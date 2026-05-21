const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');

/**
 * Suite de pruebas para la API de Products
 * Agrupa los tests por recurso mediante verbos HTTP (GET y POST) 
 * usando un enfoque guiado por comportamiento.
 */
test.describe('Products API', () => {

  test.describe('GET /objects', () => {
    
    /**
     * Prueba de humo (Smoke) que verifica que el sistema responde de
     * forma esperada al consultar un registro que sabemos que existe.
     */
    test.skip('debe obtener un producto existente por ID @smoke', async ({ request }) => {
      const productService = new ProductService(request);
      let status, body;

      // Fase Act (Acción): Se emite la petición
      await test.step('Enviar GET /objects/{id}', async () => {
        const response = await productService.getProduct('1');
        status = response.status;
        body = response.body;
      });

      // Fase Assert (Aserción): Se valida el código de respuesta y el contenido
      await test.step('Validar el status code y el body del response', async () => {
        expect(status).toBe(200);
        expect(body.hasValidId()).toBeTruthy();
        expect(body.hasName()).toBeTruthy();
        expect(body.id).toBe('1');
      });
    });

    /**
     * Prueba de regresión centrada en casos límite/negativos. Verifica
     * que la API sea resiliente y devuelva un estatus http estándar (404).
     */
    test.fixme('debe fallar al buscar un producto con ID inexistente @regression', async ({ request }) => {
      const productService = new ProductService(request);
      let status;

      // Fase Act (Acción): Búsqueda forzada con ID falso
      await test.step('Enviar GET /objects con un ID inexistente', async () => {
        const response = await productService.getProduct('id-que-no-existe-999');
        status = response.status;
      });

      // Fase Assert (Aserción): Asegura el status controlable 404
      await test.step('Validar el status code', async () => {
        expect(status).toBe(404);
      });
    });

    /**
     * test.fixme: Comunica "Este test está roto, hay un bug conocido".
     * Falla por bug QAX-142: la API devuelve 500 en lugar de 404 para IDs con caracteres especiales.
     */
    test.fixme('debe retornar 404 para IDs con caracteres especiales', async ({ request }) => {
      const productService = new ProductService(request);
      let status;

      // Fase Act (Acción)
      await test.step('Solicitar GET /objects con caracteres especiales como ID', async () => {
        const response = await productService.getProduct('abc!@#');
        status = response.status;
      });

      // Fase Assert: el código revienta con un 500, este assert fallaría. test.fixme lo permite.
      await test.step('Validar devolución controlada código HTTP 404', async () => {
        expect(status).toBe(404);
      });
    });
  });

  test.describe('POST /objects', () => {
    
    /**
     * Prueba E2E Completa (Smoke): Este test acopla una modificación del estado (POST) 
     * e inmediatamente valida su persistencia vía consulta (GET).
     */
    test('debe crear y consultar un producto @smoke', async ({ request }) => {
      const productService = new ProductService(request);
      let newProduct;
      let status, body;
      let createdProductId;

      // Fase Setup (Preparación): Instanciamos el payload del request
      await test.step('Preparar el producto a crear', async () => {
        newProduct = new ProductRequest('HP Laptop Pro', {
          year: 2024,
          price: 1849.99,
          'CPU model': 'Intel Core i9',
          'Hard disk size': '1 TB',
        });
      });

      // Fase Act (Acción): Petición POST pasando el body recién fabricado
      await test.step('Enviar POST /objects', async () => {
        const response = await productService.createProduct(newProduct);
        status = response.status;
        body = response.body;
      });

      // Fase Assert (Aserción 1): Validamos que se creó correctamente y guardamos el ID
      await test.step('Validar el status code y el body del response', async () => {
        expect(status).toBe(200);
        expect(body.hasValidId()).toBeTruthy();
        expect(body.name).toBe('HP Laptop Pro');
        expect(body.hasPriceGreaterThanZero()).toBeTruthy();
        expect(body.getPrice()).toBe(1849.99);
        
        // Guardamos el ID en memoria para el siguiente paso del test
        createdProductId = body.id;
      });

      // Fase Assert (Aserción 2): Acción y validación final para consultar el recurso por base de datos
      await test.step('Consultar el producto creado mediante GET /objects/{id}', async () => {
        const getResponse = await productService.getProduct(createdProductId);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.id).toBe(createdProductId);
        expect(getResponse.body.name).toBe('HP Laptop Pro');
      });
    });
  });

  test.describe('DELETE /objects', () => {
    
    /**
     * test.skip: Comunica "Este test no aplica todavía".
     * El endpoint DELETE no está implementado y la feature se encuentra en desarrollo.
     */
    test.skip('debe eliminar un producto por ID', async ({ request }) => {
      // implementación pendiente
    });
  });

});