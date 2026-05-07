const { test, expect } = require('@playwright/test');

test.describe('Sistema bancario HomeBanking - Mission', () => {
    
    const baseURL = 'https://homebanking-demo.onrender.com';
    const usernamed = 'bob12';
    const userPassword = 'Bob999*';
    
    let token;

    test('Smoke test - Flujo funcional', async ({ request }) => {
       const responseLogin = await request.post(`${baseURL}/auth/login`, {
            data: {
                password: userPassword,
                username: usernamed
            }
        });
        const responseBodyLogin = await responseLogin.json(); 
        const token = responseBodyLogin.token

        //Listar Cuentas
        const responseListarCuentas = await request.get(`${baseURL}/cuentas/`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        
        expect(responseListarCuentas.status()).toBe(200);
        
        //Listar transacciones
        const responseListarTransacciones = await request.get(`${baseURL}/transacciones/`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        
        expect(responseListarTransacciones.status()).toBe(200);

        //Realizar transferencia
        const responseRealizarTransferencia = await request.post(`${baseURL}/transferencias/`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            data:{
                cuenta_destino: "12345678901245",
                cuenta_origen: "ACC-FS9FO",
                monto: 10,
                motivo: "Transferencia",
                tipo: "terceros"
            }
        });

        expect(responseRealizarTransferencia.status()).toBe(200);
        const responseBodyRT = await responseRealizarTransferencia.json();
        expect(responseBodyRT.mensaje).toBe('Transferencia realizada exitosamente');

        //Realizar pago de servicio
    });
});