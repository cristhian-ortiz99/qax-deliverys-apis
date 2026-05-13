import { test, expect } from '@playwright/test';
import { generarUsuario } from '../utils/dataGenerator';


test.describe.serial('FLujo completo Registro de usuario y asignación de libro', () =>{
    
    let tokenUser;
    let ISBN;
    let uID;
    let usuarioGenerado;
    let user;

    test.beforeAll(async () => {
        usuarioGenerado = generarUsuario();
    })
    
    test('Paso 1: Registro de usuario', async ({ request }) => {
        
        const resRegistro = await request.post('Account/v1/User', {
            data: {
                userName: usuarioGenerado.username,
                password: usuarioGenerado.password
            }
        });
        expect(resRegistro.status()).toBe(201);
        const bodyRegistro = await resRegistro.json();

        uID = bodyRegistro.userID;
        user = bodyRegistro.username;

        console.log(uID);
        console.log(`✅ Usuario registrado: "${user}"`);
    });

    test('Paso 2: Generacion de token', async ({ request }) => {
        
        const resToken = await request.post('Account/v1/GenerateToken', {
            data: {
                userName: usuarioGenerado.username,
                password: usuarioGenerado.password
            }
        });
        expect(resToken.status()).toBe(200);
        const bodyToken = await resToken.json();
        tokenUser = bodyToken.token;
        console.log(bodyToken.token);
        console.log("✅ Token obtenido");
    });

    test('Paso 3: Consultar Perfil', async ({ request }) => {
        const response = await request.get(`Account/v1/User/${uID}`, {
            headers: {
                Authorization: `Bearer ${tokenUser}`
            }
        });

        expect(response.status()).toBe(200);
        const bodyRes = await response.json();
        console.log(`✅ Usuario obtenido: ${bodyRes.userId}`);
    });

    test('Paso 4: Obtener 1er libro', async ({ request }) => {
        const res = await request.get('BookStore/v1/Books');

        expect(res.status()).toBe(200);
        const bodyRes = await res.json();
        ISBN = bodyRes.books[0].isbn;
        console.log(`✅ Libro obtenido: ${ISBN}`);
    });

    test('Paso 5: Agregar libro obtenido al usuario', async ({ request }) => {
        
        const res = await request.post('BookStore/v1/Books', {
            headers: {
                Authorization: `Bearer ${tokenUser}`
            },
            data: {
                userId: uID,
                collectionOfIsbns: [
                    {
                        isbn: ISBN
                    }
                ]
            }
        });
        expect(res.status()).toBe(201);
        const bodyres = await res.json();
        console.log("✅ Libro agregado con exito");
        console.log(`LIBRO AGREGADO: ${bodyres.books[0].isbn}`);
    });

});

test.describe('Casos de prueba negativos', () => {
    
    let usuario2;
    let uID2;

    test.beforeAll(async () => {
        usuario2 = generarUsuario();
    })

    test('CP01: Crear usuario con datos invalidos', async ({ request }) => {
        
        const resRegistro = await request.post('Account/v1/User', {
            data: {
                userName: null,
                password: usuario2.password
            }
        });
        expect(resRegistro.status()).toBe(400);
        const bodyRegistro = await resRegistro.json();

        console.log(bodyRegistro.message);
    });

    test('CP02: Generacion de token con credenciales invalidas', async ({ request }) => {
        
        const resToken = await request.post('Account/v1/GenerateToken', {
            data: {
                userName: usuario2.username,
                password: usuario2.password
            }
        });
        expect(resToken.status()).toBe(200);
        const bodyToken = await resToken.json();

        console.log(bodyToken.result);
    });

    test('CP03: Realizar petición sin autorizathion a usuario registrado', async ({ request }) => {
        
        const resRegistro = await request.post('Account/v1/User', {
            data: {
                userName: usuario2.username,
                password: usuario2.password
            }
        });
        expect(resRegistro.status()).toBe(201);
        const bodyRegistro = await resRegistro.json();
        uID2 = bodyRegistro.userID;
        console.log(uID2);
        console.log(`✅ Usuario registrado: "${bodyRegistro.username}"`);

        const response = await request.get(`Account/v1/User/${uID2}`);

        expect(response.status()).toBe(401);
        const bodyRes = await response.json();
        console.log(bodyRes.message);


    });
});
