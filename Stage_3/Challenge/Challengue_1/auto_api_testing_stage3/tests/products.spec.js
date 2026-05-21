
const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');

test.describe('Products API — GET y POST', () => {

  test('debe obtener un producto existente por ID @smoke', async ({ request }) => {
    const productService = new ProductService(request);

    await test.step('Llamar GET /objects/{id} con un ID válido', async () => {
      const { status, body } = await productService.getProduct('1');

      await test.step('Validar status 200', async () => {
        expect(status).toBe(200);
      });

      await test.step('Validar que el producto tiene ID y nombre', async () => {
        expect(body.hasValidId()).toBeTruthy();
        expect(body.hasName()).toBeTruthy();
      });

      await test.step('Validar que el ID coincide con el solicitado', async () => {
        expect(body.id).toBe('1');
      });
    });
  });

  test('debe crear un nuevo producto correctamente @smoke', async ({ request }) => {
    const productService = new ProductService(request);

    const newProduct = new ProductRequest('HP Laptop Pro', {
      year: 2024,
      price: 1849.99,
      'CPU model': 'Intel Core i9',
      'Hard disk size': '1 TB',
    });

    await test.step('Llamar POST /objects con un producto válido', async () => {
      const { status, body } = await productService.createProduct(newProduct);

      await test.step('Validar status 200', async () => {
        expect(status).toBe(200);
      });

      await test.step('Validar que la respuesta tiene un ID generado', async () => {
        expect(body.hasValidId()).toBeTruthy();
      });

      await test.step('Validar que el nombre coincide con el enviado', async () => {
        expect(body.name).toBe('HP Laptop Pro');
      });

      await test.step('Validar que el precio fue guardado correctamente', async () => {
        expect(body.hasPriceGreaterThanZero()).toBeTruthy();
        expect(body.getPrice()).toBe(1849.99);
      });
    });
  });

  test('debe fallar al buscar un producto con ID inexistente @regression', async ({ request }) => {
    const productService = new ProductService(request);

    await test.step('Llamar GET /objects con un ID que no existe', async () => {
      const { status } = await productService.getProduct('id-que-no-existe-999');

      await test.step('Validar que el status es 404', async () => {
        expect(status).toBe(404);
      });
    });
  });

  ///////////CHALLENGUE 1/////////////////

  test('flujo completo: crear y reemplazar un producto con PUT @regression', async ({ request }) => {
  const productService = new ProductService(request);
  let productId;
  let nameProducto;
  let newNameProducto;
  let newProduct;
  let updateProduct;
  await test.step('POST: Crear el producto inicial', async () => {
    // Crea un producto con nombre "Apple MacBook Pro 16" y data con year, price y CPU model
    // Guarda el id generado en productId
    // Valida status 200 e id válido
    newProduct = new ProductRequest('Apple MacBook Pro 16', {
      year: 2026,
      price: 2000.99,
      'CPU model': 'IOS 20',
      'Hard disk size': '2 TB',
    });

    const { status, body } = await productService.createProduct(newProduct);

    productId = body.id;
    nameProducto = body.name
    expect(status).toBe(200);
    expect(body.hasValidId()).toBeTruthy();
    console.log (`ID obtenido: ${productId}`);
  });

  await test.step('GET: Verificar que el producto fue creado correctamente', async () => {
    // Consulta el producto por productId
    // Valida status 200 y que el nombre coincide con el enviado en el POST
    const { status: getStatus, body:getBody } = await productService.getProduct(`${productId}`);
    expect(getStatus).toBe(200);
    expect(getBody.name).toBe(nameProducto);
    console.log (`Nombre del producto: ${getBody.name}`);
  });

  await test.step('PUT: Reemplazar el producto completo por uno nuevo', async () => {
    // Crea un nuevo ProductRequest con nombre "HP Pavilion" y data diferente
    // Llama a updateProduct con productId y el nuevo request
    // Valida status 200 y que el nombre en el response es "HP Pavilion"
    updateProduct = new ProductRequest('HP Pavilion', {
      year: 2027,
      price: 1500.50,
      'CPU model': 'RYZEN 7',
      'Hard disk size': '3 TB',
    });
    const { status: putStatus, body:putBody } = await productService.updateProduct(`${productId}`,updateProduct);
    expect(putStatus).toBe(200);
    expect(putBody.name).toBe(updateProduct.name);
    newNameProducto = putBody.name;
    console.log (`ID obtenido: ${productId}`);
    console.log (`Nombre actualizado: ${putBody.name}`);
  });

  await test.step('GET: Confirmar que el producto refleja el reemplazo total', async () => {
    // Consulta el producto por productId
    // Valida que el nombre ahora es "HP Pavilion"
    // Valida que los datos de data corresponden al PUT, no al POST original
    const { status: getNewStatus, body:getNewBody } = await productService.getProduct(`${productId}`);
    expect(getNewStatus).toBe(200);
    expect(getNewBody.name).toBe(newNameProducto);
    expect(getNewBody.name).toBe(updateProduct.name);
    expect(getNewBody.data.year).toBe(updateProduct.data.year);
  });
});

  test('debe actualizar solo el nombre con PATCH sin afectar otros campos @regression', async ({ request }) => {
  const productService = new ProductService(request);
  let productId;
  let originalPrice;
  let newProduct;
  await test.step('POST: Crear un producto con precio conocido', async () => {
    // Crea un producto con name "Dell XPS 15" y data con price: 1500
    // Guarda productId y guarda el price original en originalPrice
    newProduct = new ProductRequest('Dell XPS 15', {
      year: 2026,
      price: 1500.00,
      'CPU model': 'CORE I9',
      'Hard disk size': '1 TB',
    });

    const { status, body } = await productService.createProduct(newProduct);

    expect(status).toBe(200);
    expect(body.hasValidId()).toBeTruthy();
    productId = body.id;
    originalPrice = body.data.price;
    console.log (`ID obtenido: ${productId}`);

  });

  await test.step('PATCH: Actualizar solo el nombre', async () => {
    // Llama a patchProduct enviando solo { name: "Dell XPS 15 Updated" }
    // Valida status 200
    // Valida que el nombre en el response cambió
    const { status: patchStatus, body:patchBody } = await productService.patchProduct(`${productId}`,{
      name: "Dell XPS 15 Updated"
    });
    expect(patchStatus).toBe(200);
    expect(patchBody.name).toBe('Dell XPS 15 Updated');
    console.log (`Nuevo nombre: ${patchBody.name}`);
  });

  await test.step('GET: Verificar que el precio no fue afectado', async () => {
    // Consulta el producto por productId
    // Valida que el nombre es "Dell XPS 15 Updated"
    // Valida que el precio sigue siendo originalPrice
    const { status: getStatus, body:getBody } = await productService.getProduct(`${productId}`);
    expect(getStatus).toBe(200);
    expect(getBody.name).toBe('Dell XPS 15 Updated');
    expect(getBody.data.price).toBe(originalPrice);
    console.log(`Validación de campos exitosa: ${getBody.name}`);
    console.log (`ID de producto: ${getBody.id}`);
  });
});


});