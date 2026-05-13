# Mission2 APIs - fakePlatzi 

## Descripción del Proyecto

Este proyecto contiene pruebas automatizadas de APIs utilizando Playwright y JavaScript.  
El objetivo principal fue validar operaciones CRUD relacionadas con usuarios, categorías y productos consumiendo una API REST.

---

# Estructura del Proyecto

La estructura del proyecto fue organizada separando responsabilidades para facilitar el mantenimiento y reutilización del código.


---

# Organización de Carpetas


## utils/

Contiene funciones reutilizables para generación de datos dinámicos usando Faker.

Esto ayudó a:
- evitar datos repetidos
- mantener independencia entre tests
- reutilizar lógica
- mejorar legibilidad

---

# Manejo del ID del Producto hacia el Carrito

Para generar un producto primero fue necesario crear la categoria dinámicamente y obtener su ID desde la respuesta del API, entonces mediante el uso de la funcionalidad .serial se guarda el idcategoria al momento de generarla y luego enviar este id al Producto.

## Flujo implementado

1. Flujo principal E2E FakePlatzi
2. Obtener información del usuario
3. Encontrar usuario creado en la lista
4. Consultar categoria creada
5. Consultar categoria creada en lista de categorias
6. Consultar productos en lista de productos, asociados a una categoria

---

# Librerías Utilizadas

- Playwright
- Faker
- Node.js

---

# Ejecución del Proyecto

## Instalar dependencias

```bash
npm install
```

## Ejecutar pruebas

```bash
npx playwright test tests/fakePlatziApi.spec.js
```

## Ejecutar pruebas secuenciales

```bash
npx playwright test --workers=1
```

---

# Consideraciones

- Se utilizaron datos dinámicos con Faker para evitar conflictos de duplicidad.
- Los tests fueron diseñados para ser independientes.
- Debido a que la API utilizada es gratuita, ocasionalmente pueden presentarse respuestas inestables o lentitud.