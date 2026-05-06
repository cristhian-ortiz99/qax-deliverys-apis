const { test, expect } = require('@playwright/test');

// ¡No podemos hacer Login si primero no nos Registramos!
test.describe('Estado del Sistema y Autenticación', () => {
    
    const baseURL = 'https://practice.expandtesting.com/notes/api';
    const userEmail = `ninja4tester_10123@qaxpert.com`;
    const userPassword = 'Password123!';

    test('CP01 - Verificar la salud de la API (Health Check)', async ({ request }) => {
        // 1. Hacemos la petición (Igual que el botón SEND en Postman)
        const response = await request.get(`${baseURL}/health-check`);
        
        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta y validamos el mensaje
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Notes API is Running');
    });

    test('CP02 - Registrar un usuario exitosamente', async ({ request }) => {
        const response = await request.post(`${baseURL}/users/register`, {
            data: {
                name: 'Ninja Tester',
                email: userEmail,
                password: userPassword
            }
        });
        
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('User account created successfully');
    });

    test('CP03 - Iniciar sesión con credenciales válidas', async ({ request }) => {
        const response = await request.post(`${baseURL}/users/login`, {
            data: {
                email: userEmail,
                password: userPassword
            }
        });
        
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('Login successful');
        // Validamos que el token realmente venga en la respuesta
        expect(responseBody.data.token).toBeDefined(); 
    });

});