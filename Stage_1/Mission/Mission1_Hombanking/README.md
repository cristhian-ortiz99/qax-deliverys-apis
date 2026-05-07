# Mission 1 - Stage 1 - Smoke test Homebanking API

## Casos de prueba redactados en GHERKIN

### Scenario: CP01 - Registrar usuario

Given cuando el usuario realiza ingresa por primera vez
And no posee una cuenta registrada
When envia una petición POST a "/auth/registro"
And envía en el body:
"""
    {
        email: "bob342@gmail.com",
        name: "bob",
        password: "Bob999*",
        username: "bob12"
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And la respuesta debe confirmar que el usuario se registró exitosamente

### Scenario: CP02 - Login usuario

Given cuando el usuario se encuentra registrado
When envia una petición POST a "/auth/login"
And envía en el body:
"""
    {
        password: "Bob999*",
        username: "bob12"
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And se obtiene un token de autenticación
And se muestra el mensaje de respuesta "Sesión iniciada exitosamente"

### Scenario: CP03 - Resetear sistema

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición POST a "/sistema/resetear"
And incluye el Bearer Token en el header Autorization
Then el codigo del estado de la respuesta debe ser 200
And se muestra el mensaje indicando que el servidor fue restablecido

### Scenario: CP04 - Intento resetear sistema sin token

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición POST a "/sistema/resetear"
And NO incluye el Bearer Token en el header Autorization
Then el codigo del estado de la respuesta debe ser 403
And se muestra el mensaje indicando que no se encuentra autenticado

### Scenario: CP05 - Listar Cuentas

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición GET a "/cuentas/"
And incluye el Bearer Token en el header Autorization
Then el codigo del estado de la respuesta debe ser 200
And se muestra la lista de cuentas del usuario logueado

### Scenario: CP06 - Generar tarjeta

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
And posee una cuenta bancaria valida asociada
When envia una petición POST a "/tarjetas/"
And envía una id_cuenta_asociada valida del usuario
And envía en el body:
"""
    {
        id_cuenta_asociada: "ACC-FS9FO",
        marca: "Visa",
        tipo: "Débito"
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And se muestra el mensaje de generación de tarjeta exitoso

### Scenario: CP07 - Generar tarjeta con cuenta inexistente

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición POST a "/tarjetas/"
And envía una id_cuenta_asociada invalida del usuario
And envía en el body:
"""
    {
        id_cuenta_asociada: "123ACF",
        marca: "Visa",
        tipo: "Débito"
    }
"""
Then el codigo del estado de la respuesta debe ser 404
And se muestra el mensaje que indica que la cuenta asociada no existe

### Scenario: CP08 - Generar tarjeta con cuenta ya registrada en otra tarjeta

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
And posee una cuenta bancaria asociada a una tarjeta de debito
When envia una petición POST a "/tarjetas/"
And envía una id_cuenta_asociada asociada ya una tarjeta de debito
And envía en el body:
"""
    {
        id_cuenta_asociada: "ACC-FS9FO",
        marca: "Visa",
        tipo: "Débito"
    }
"""
Then el codigo del estado de la respuesta debe ser 400
And se muestra el mensaje que indica que la cuenta ya se encuentra asociada a una tarjeta de debito

### Scenario: CP09 - Listar Tarjetas

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición GET a "/tarjetas/"
And incluye el Bearer Token en el header Autorization
Then el codigo del estado de la respuesta debe ser 200
And se muestra la lista de tarjetas asociadas al usuario

## Descripción
Para el desarrollo de este smoke test se realizó la validación de un flujo crítico end to end, el cual valida desde el login de un cliente registrado, listar sus cuentas, listar sus transacciones y la validación al realizar transferencias bancarias lo que garantiza la funcionalidad del negocio en su nivel básico

---

## Alcance de pruebas

El smoke test abarca los siguientes flujos:

-  Login de usuario
-  Listar Cuentas
-  Lisar transacciones
-  Realizar transferencias

---

## Tecnologías utilizadas

- Node.js
- Playwright
- JavaScript
- Postman (para pruebas manuales)

---

## 👨‍💻 Autor

Cristhian Ortiz Ysla