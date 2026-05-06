# Practica 1 - Solicitudes en Postman y redacción en Gherkin

## Feature: Consulta de perfil de usuario, cambio de contraseña y mecanismo para recuperar cuenta

Como usuario registrado de la aplicación
Quiero poder ver la información de mi perfil, cambiar mi contraseña actual y tener un mecanismo para recuperar mi cuenta si olvido mi clave
Para gestionar mi cuenta de forma segura y no perder acceso a mis notas

---

### Scenario: CP01 - Consultar perfil de usuario

Given que el usuario realiza un login y obtiene un token valido
When envia una petición GET a "/users/profile"
And incluye el header "x-auth-token" con el token obtenido al realizar el login
Then el codigo del estado de la respuesta debe ser 200
And la respuesta debe contener los datos del usuario: Id, name y email

### Scenario: CP02 - Cambiar contraseña

Given que el usuario realiza un login y obtiene un token valido
When envia una petición POST a "/users/change-password"
And incluyo el header "x-auth-token" con el token obtenido al realizar el login
And envío en el body:
"""
    {
        "email": userEmail,
        "password": userPassword
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And la respuesta debe confirmar que se actualizó correctamente la contraseña

### Scenario: CP03 - Envío email

Given la API se encuentra disponible
When envia una petición POST a "/users/forgot-password"
And envío en el body:
"""
    {
    "email": userEmail
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And la respuesta debe indicar que se envió el enlace

### Scenario: CP04 - Validar Token

Given el usuario tiene un token de recuperación valido
When envia una petición POST a "/users/verify-reset-password-token"
And envío en el body:
"""
    {
    "token": "dcbb5d82c6eb4a87a20a59f68461a9d89dcad90807714305bb061a524fe5d01e"
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And la respuesta debe contener un mensaje de "The provided password reset token is valid"

### Scenario: CP05 - Restablecer contraseña

Given el usuario tiene un token de recuperación valido
When envia una petición POST a "/users/reset-password"
And envío en el body:
"""
    {
    "token": "dcbb5d82c6eb4a87a20a59f68461a9d89dcad90807714305bb061a524fe5d01e",
    "newPassword": "Cristhian12$$%%"
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And la respuesta debe indicar que el cambio de contraseña se aplicó correctamente

---
