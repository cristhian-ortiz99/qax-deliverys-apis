# Challengue 2 - Stage 2 - Automatizando un flujo completo usando token

## Casos de prueba redactados en GHERKIN

### Scenario: CP01 - Registrar usuario

Given cuando el usuario realiza ingresa por primera vez
And no posee una cuenta registrada
When envia una petición POST a "Account/v1/User"
And envía en el body:
"""
    {
        userName: username,
        password: password
    }
"""
Then el codigo del estado de la respuesta debe ser 201
And la respuesta debe confirmar que el usuario se registró exitosamente

### Scenario: CP02 - Crear usuario con datos invalidos

Given cuando el usuario realiza ingresa por primera vez
And no posee una cuenta registrada
When envia una petición POST a "Account/v1/User"
And envía en el body:
"""
    {
        userName: null,
        password: password
    }
"""
Then el codigo del estado de la respuesta debe ser 400
And la respuesta debe mostrar el mensaje de error.

### Scenario: CP03 - Generacion de token

Given cuando el usuario se encuentra registrado
When envia una petición POST a "Account/v1/GenerateToken"
And envía en el body:
"""
    {
        userName: username,
        password: password
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And se obtiene un token de autenticación
And se muestra el mensaje en el que se obtuvo el token

### Scenario: CP04 - Generacion de token con credenciales invalidas

Given cuando el usuario no se encuentra registrado
When envia una petición POST a "Account/v1/GenerateToken"
And envía en el body:
"""
    {
        userName: username,
        password: password
    }
"""
Then el codigo del estado de la respuesta debe ser 200
And se muestra el mensaje de autenticación fallida.

### Scenario: CP05 - Consultar perfil

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición POST a "Account/v1/User/ID"
And incluye el Bearer Token en el header Autorization
Then el codigo del estado de la respuesta debe ser 200
And se muestra el mensaje indicando se obtuvo la información del usuario.

### Scenario: CP06 - Realizar petición sin autorizathion a usuario registrado

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición POST a "Account/v1/User/ID"
And NO incluye el Bearer Token en el header Autorization
Then el codigo del estado de la respuesta debe ser 401
And se muestra el mensaje de acceso denegado.

### Scenario: CP07 - Obtener libros

Given cuando el usuario se encuentra logueado
When envia una petición GET a "BookStore/v1/Books"
Then el codigo del estado de la respuesta debe ser 200
And se muestra la lista de libros disponibles.

### Scenario: CP08 - Agregar libro al usuario

Given cuando el usuario se encuentra logueado
And obtiene un token de autenticacion valido
When envia una petición POST a "BookStore/v1/Books"
And incluye el Bearer Token en el header Autorization
And envía en el body:
"""
    {
        userId: uID,
        collectionOfIsbns: [
                {
                    isbn: ISBN
                }
        ]
    }
"""
Then el codigo del estado de la respuesta debe ser 201
And se muestra el mensaje de confirmación de asignación de libro exitoso.


## Descripción
Para el desarrollo de este flujo completo de pruebas se realizó el flujo completo que abarca desde la generación de un usuario hasta la asignación del primer libro obtenido de una lista de libros disponibles.
---

## Alcance de pruebas

El smoke test abarca los siguientes flujos:

-  Registro de usuario
-  Generacion de token
-  Consultar Perfil
-  Obtener 1er libro
-  Agregar libro obtenido al usuario

---

## Tecnologías utilizadas

- Node.js
- Playwright
- JavaScript
- Postman (para pruebas manuales)

---

## 👨‍💻 Autor

Cristhian Ortiz Ysla