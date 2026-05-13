# QuickTask3

Proyecto desarrollado utilizando JavaScript y Playwright para la automatización de pruebas API aplicando arquitectura basada en Service Layer, Serialización, Deserialización y Programación Orientada a Objetos (POO).

---

# Tecnologías utilizadas

- JavaScript
- Node.js
- Playwright
- Dotenv

---

# Arquitectura implementada

El proyecto fue estructurado utilizando una separación de responsabilidades para mantener un código reutilizable, limpio y escalable.

## Service Layer

Se implementó una capa de servicios encargada de centralizar las peticiones HTTP hacia los endpoints de la API.

### Beneficios
- Reutilización de métodos
- Separación de lógica HTTP
- Tests más limpios
- Fácil mantenimiento

---

# Variables de entorno

Se utilizó un archivo `.env` para almacenar configuraciones sensibles como la URL

El archivo `.env` fue agregado al `.gitignore` para evitar exponer información sensible en el repositorio.

---

# Ejecución del proyecto

## Instalar dependencias

```bash
npm install
```

## Ejecutar pruebas

```bash
npx playwright test
```

## Visualizar reporte

```bash
npx playwright show-report
```

---

# Objetivo del proyecto

El objetivo principal fue aplicar buenas prácticas de automatización API utilizando una arquitectura escalable y mantenible mediante:

- Service Layer
- Serialización
- Deserialización
- POO
- Manejo de variables de entorno
