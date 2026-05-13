import { test, expect } from '@playwright/test';
import { generarUsuario } from '../utils/dataGenerator';
import { crearCuentaCorreo, obtenerUltimoCorreo, extraerTokenDeCorreo } from '../utils/TmpEmailReader';

// .serial obliga a ejecutar los tests en orden. Si falla el registro, no intenta hacer login.
test.describe.serial('Flujo End-to-End: Perfil y Cambio de Contraseña', () => {
    
    // 1. Variables compartidas para todo el flujo
    let tokenAuth;
    let usuarioDinamico;
    let emailCorreo;
    let tokenCorreo;
    let tokenReset;
    //let nuevaPassword = 'NewPassword123!';

    // Antes de todos los tests, generamos la data
    test.beforeAll(async () => {
        usuarioDinamico = generarUsuario();
        try {
            const usuario = usuarioDinamico.email;
            const cuenta = await crearCuentaCorreo(usuario, usuarioDinamico.password);
            emailCorreo = cuenta.email;
            tokenCorreo = cuenta.token;
            console.log(`📬 Buzón auxiliar listo: ${emailCorreo}`);
            console.log(tokenCorreo);
        } catch (error) {
            console.log('⚠️ Mail.tm no está disponible. Se usará un correo ficticio.');
            console.log('   Los pasos de lectura de correo se saltarán.');
        }
    });

    test('Paso 1: Preparación - Registrar y Loguear usuario', async ({ request }) => {
        // Registro
        const email = emailCorreo;
        const resRegistro = await request.post('users/register', {
            data: {
                name: usuarioDinamico.name,
                email: email,
                password: usuarioDinamico.password
            }
        });
        expect(resRegistro.status()).toBe(201);

        emailCorreo = email;
        
        console.log('✅ Usuario registrado');
        // Login inmediato para obtener el token
        const resLogin = await request.post('users/login', {
            data: {
                email: emailCorreo,
                password: usuarioDinamico.password
            }
        });
        expect(resLogin.status()).toBe(200);

        const bodyLogin = await resLogin.json();
        // ¡Atrapamos el token! y lo guardamos en la variable compartida
        tokenAuth = bodyLogin.data.token;
        console.log('Token obtenido con éxito!');
        console.log(bodyLogin.data.email);
    });

    test('Paso 2: Solicitar recuperación de contraseña (forgot-password)', async ({ request }) => {
        const res = await request.post('users/forgot-password', {
            data: { email: emailCorreo }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log(`✅ ${body.message}`);
        expect(body.success).toBe(true);
    });

    test('Paso 3: Leer el correo de recuperación, extraer el token', async () => {
        if (!tokenCorreo) {
            console.log('⚠️ Sin buzón de Mail.tm, no se puede leer el correo.');
            console.log('   El flujo de API ya fue probado en los pasos anteriores.');
            test.skip();
            return;
        }

        console.log('⏳ Esperando el correo de recuperación...');
        const correo = await obtenerUltimoCorreo(tokenCorreo);

        console.log(`📧 Asunto: "${correo.subject}"`);
        console.log(`📝 De: "${correo.from?.address || 'desconocido'}"`);

        const contenidoCompleto = (correo.text || '') + '\n' + (correo.html || '');
        tokenReset = extraerTokenDeCorreo(contenidoCompleto);

        expect(tokenReset).not.toBeNull();
        expect(tokenReset.length).toBeGreaterThan(5);
    });

    test('Paso 4: Validar token de recuperacion', async ({ request }) => {
        const res = await request.post('users/verify-reset-password-token', {
            data: { token: tokenReset }
        });
        expect(res.status()).toBe(200);
        const bodyres = await res.json();
        console.log(`✅ ${bodyres.message}`);
    });

    test('Paso 5: Restablecer contraseña', async ({ request }) => {
        if (!tokenReset) { test.skip(); return; }

        const res = await request.post('users/reset-password', {
            data: { token: tokenReset, newPassword: usuarioDinamico.nuevaPassword }
        });
        expect(res.status()).toBe(200);
        const bodyres = await res.json();
        console.log(`✅ ${bodyres.message}`);
    });

    test('Paso 6: Iniciar sesión con la nueva contraseña', async ({ request }) => {
        if (!tokenReset) { test.skip(); return; }

        const res = await request.post('users/login', {
            data: { email: emailCorreo, password: usuarioDinamico.nuevaPassword }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log('✅ Login con nueva contraseña exitoso');
        expect(body.data.email).toBe(emailCorreo);
        console.log(body.data.email);
        console.log('✅FLUJO COMPLETADO CON EXITO');
    });

    
    /*test('Paso 2: Consultar Perfil con el Token (GET)', async ({ request }) => {
        const response = await request.get('users/profile', {
            headers: {
                // Inyectamos el token en el header usando la clave exigida por la API
                'x-auth-token': tokenAuth 
            }
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json();
        // Validamos que el perfil devuelto sea exactamente el del usuario que creamos
        expect(body.data.email).toBe(usuarioDinamico.email);
        expect(body.data.name).toBe(usuarioDinamico.name);
    });*/

    /*test('Paso 3: Cambiar Contraseña usando el Token (POST)', async ({ request }) => {
        const response = await request.post('users/change-password', {
            headers: {
                'x-auth-token': tokenAuth
            },
            data: {
                currentPassword: usuarioDinamico.password,
                newPassword: nuevaPassword
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('The password was successfully updated');
    });*/
});