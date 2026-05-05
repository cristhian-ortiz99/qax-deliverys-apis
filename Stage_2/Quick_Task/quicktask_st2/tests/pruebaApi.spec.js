const { test, expect } = require('@playwright/test');
const {generarEmailAleatorio} = require('../utils/utils');



test.describe('Prueba de usuario dinamico', () => {
    
    const baseURL = 'https://practice.expandtesting.com/notes/api';
    const userPassword = 'Password123!';

    test('CP01 - Validar el correcto registro de usuario', async ({ request }) => {
        const email = generarEmailAleatorio();
        
        const response = await request.post(`${baseURL}/users/register`,{
            data:{
                name: 'Cristhian',
                email: email,
                password: userPassword
            }
        });
        
        
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        const userID = responseBody.data.id;
        const userCorreo = responseBody.data.email

        console.log('ID: ',userID,'\nCorreo: ',userCorreo);
        

        expect(responseBody.message).toBe('User account created successfully');
    });

});