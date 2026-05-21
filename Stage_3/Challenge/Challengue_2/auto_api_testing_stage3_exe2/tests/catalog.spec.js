const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');

/**
 * Suite de pruebas para la API de Catálogo
 * Agrupa los tests por flujo de negocio (GET /objects/{id} y POST /objects)
 */
test.describe('Catalog API', () => {

  test.describe('GET /objects/{id}', () => {

    /**
     * Prueba de validación de registros por ID.
     */
    test('debe retornar un producto válido para el ID 1 @smoke', async ({ request }) => {
      const productService = new ProductService(request);
      let status, body;

      // Fase Act (Acción): Petición al endpoint
      await test.step('Enviar GET /objects/{id} con ID 1', async () => {
        const response = await productService.getProduct('1');
        status = response.status;
        body = response.body;
      });

      // Fase Assert (Aserción): Validación de los datos esperados
      await test.step('Validar el status code y el cuerpo del response', async () => {
        expect(status).toBe(200);
        expect(body.hasValidId()).toBeTruthy();
        expect(body.hasName()).toBeTruthy();
        expect(body.id).toBe('1');
      });
    });

    /**
     * Prueba de regresión para validar la gestión de errores con IDs no reconocidos.
     */
    test('debe retornar 404 para un ID inexistente @regression', async ({ request }) => {
      const productService = new ProductService(request);
      let status;

      // Fase Act: Enviar un ID manifiestamente inválido
      await test.step('Enviar GET /objects/{id} con un ID que no existe', async () => {
        const response = await productService.getProduct('id-inexistente-00000');
        status = response.status;
      });

      // Fase Assert: Validar error tipificado
      await test.step('Validar el status code de error', async () => {
        expect(status).toBe(404);
      });
    });

    /**
     * test.skip: Comunica "Este test no aplica todavía".
     * El endpoint de búsqueda por nombre no está disponible en esta versión de la API
     * ya que el feature sigue en desarrollo.
     */
    test.skip('debe filtrar productos por nombre @regression', async ({ request }) => {
      // pendiente de implementación en el backend
    });

  });

  test.describe('POST /objects', () => {

    /**
     * Prueba completa Create + Read para comprobar que es posible crear un 
     * producto y consultar inmediatamente la nueva creación.
     */
    test('debe crear y consultar un producto laptop correctamente @smoke', async ({ request }) => {
      const productService = new ProductService(request);
      let laptop;
      let status, body;
      let createdProductId;

      // Fase Setup: Prepara un request de producto detallado
      await test.step('Preparar el producto a crear', async () => {
        laptop = new ProductRequest('Ninja Laptop Pro', {
          year: 2024,
          price: 2499.99,
          'CPU model': 'Apple M3 Pro',
          'Hard disk size': '512 GB',
        });
      });

      // Fase Act: Envía la petición POST
      await test.step('Enviar POST /objects para crearlo', async () => {
        const response = await productService.createProduct(laptop);
        status = response.status;
        body = response.body;
      });

      // Fase Assert 1: Validación de base
      await test.step('Validar el status code y el body del response', async () => {
        expect(status).toBe(200);
        expect(body.hasValidId()).toBeTruthy();
        expect(body.name).toBe('Ninja Laptop Pro');
        expect(body.getPrice()).toBe(2499.99);
        createdProductId = body.id;
      });
      
      // Fase Assert 2: Llamada GET inmediata y validación final de persistencia
      await test.step('Consultar el producto creado mediante GET /objects/{id}', async () => {
        const getResponse = await productService.getProduct(createdProductId);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.id).toBe(createdProductId);
        expect(getResponse.body.name).toBe('Ninja Laptop Pro');
      });
    });

    /**
     * Prueba de regresión creando un producto proporcionando únicamente el nombre (campos mínimos).
     */
    test('debe crear un producto sin data adicional @regression', async ({ request }) => {
      const productService = new ProductService(request);
      let simpleProduct, status, body;

      // Fase Setup: Producto mínimo 
      await test.step('Preparar el producto mínimo a crear', async () => {
        simpleProduct = new ProductRequest('Producto Mínimo');
      });

      // Fase Act: Enviar la petición
      await test.step('Enviar POST /objects con el producto mínimo', async () => {
        const response = await productService.createProduct(simpleProduct);
        status = response.status;
        body = response.body;
      });

      // Fase Assert
      await test.step('Validar que se generó ID exitosamente', async () => {
        expect(status).toBe(200);
        expect(body.hasValidId()).toBeTruthy();
        expect(body.name).toBe('Producto Mínimo');
      });
    });

    /**
     * test.fixme: Comunica "Este test está roto, hay un bug conocido".
     * Bug QAX-201: La API acepta productos con precio negativo cuando debería retornar 400.
     */
    test.fixme('debe rechazar un producto con precio negativo @regression', async ({ request }) => {
      const productService = new ProductService(request);
      let invalidProduct, status;

      // Fase Setup
      await test.step('Preparar el producto inválido a crear', async () => {
        invalidProduct = new ProductRequest('Producto Inválido', { price: -100 });
      });

      // Fase Act
      await test.step('Enviar POST /objects con producto de precio negativo', async () => {
        const response = await productService.createProduct(invalidProduct);
        status = response.status;
      });

      // Fase Assert
      await test.step('Validar el código de error para denegación', async () => {
        expect(status).toBe(400); // Se marca .fixme porque falla retornando 200 temporalmente
      });
    });

  });

});