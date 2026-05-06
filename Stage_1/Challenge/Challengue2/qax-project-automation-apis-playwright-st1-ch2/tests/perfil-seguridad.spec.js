const { test, expect } = require('@playwright/test');

test.describe('Challengue2', () => {
    
    const baseURL = 'https://practice.expandtesting.com/notes/api';
    const userEmail = `cristianortizysla123@gmail.com`;
    const userPassword = 'Cristhian12$$';
    
    let token;

    test('CP01 - Consultar perfil de usuario', async ({ request }) => {
       const responseLogin = await request.post(`${baseURL}/users/login`, {
            data: {
                email: userEmail,
                password: userPassword
            }
        });
        const responseBodyLogin = await responseLogin.json(); 
        token = responseBodyLogin.data.token
        
        const response = await request.get(`${baseURL}/users/profile`,{
            headers:{
                'x-auth-token': token
            }
        });
        
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('Profile successful');
    });

    test('CP02 - Cambiar contraseña', async ({ request }) => {
       const responseLogin = await request.post(`${baseURL}/users/login`, {
            data: {
                email: userEmail,
                password: userPassword
            }
        });
        const responseBodyLogin = await responseLogin.json(); 
        token = responseBodyLogin.data.token
        
        const response = await request.post(`${baseURL}/users/change-password`,{
            headers:{
                'x-auth-token': token
            },
            data:{
                currentPassword: userPassword,
                newPassword: "Cristhian12$$$"
            }
        });
        
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('The password was successfully updated');
    });

    test('CP03 - Envío correo', async ({ request }) => {
       const response = await request.post(`${baseURL}/users/forgot-password`,{
            data:{
                email: userEmail,
            }
        });
        
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toContain("Password reset link successfully");
    });

    test('CP04 - Validar token', async ({ request }) => {
       const response = await request.post(`${baseURL}/users/verify-reset-password-token`,{
            data:{
                token: "dcbb5d82c6eb4a87a20a59f68461a9d89dcad90807714305bb061a524fe5d01e",
            }
        });
        
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe("The provided password reset token is valid");
    });

    test('CP05 - Reset pass', async ({ request }) => {
       const response = await request.post(`${baseURL}/users/reset-password`,{
            data:{
                token: "dcbb5d82c6eb4a87a20a59f68461a9d89dcad90807714305bb061a524fe5d01e",
                newPassword: "Cristhian12$$%%"
            }
        });
        
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe("The password was successfully updated");
    });
});