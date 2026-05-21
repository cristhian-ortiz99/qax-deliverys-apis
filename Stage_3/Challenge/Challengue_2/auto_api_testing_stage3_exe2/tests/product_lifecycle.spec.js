const { test, expect } = require('@playwright/test');
const { ProductService } = require('../src/services/ProductService');
const { ProductRequest } = require('../src/models/ProductRequest');



test.describe('Product Lifecycle E2E @regression',() => {

    test('ciclo de vida completo de un producto @regression', async({request}) => {
        const productService = new ProductService(request);
        let newProduct;
        let updateProduct;
        let updateProduct2;
        let IdProducto;
        let postStatus;
        let postBody;
        let updateStatus;
        let updateStatus2;
        let updateBody;
        let updateBody2;
        let patchStatus;
        let patchBody;

        await test.step('Preparar el producto a crear', async () => {
        newProduct = new ProductRequest('HP Laptop Pro', {
          year: 2025,
          price: 2140.55,
          'CPU model': 'Intel Core i8',
          'Hard disk size': '2 TB',
        });
        });

        await test.step('POST - Crear el producto inicial', async () => {
            const postResponse = await productService.createProduct(newProduct);
            postStatus = postResponse.status;
            postBody = postResponse.body;
        });

        await test.step('Validar el status code y el body del response', async () => {
        expect(postStatus).toBe(200);
        expect(postBody.hasValidId()).toBeTruthy();
        expect(postBody.name).toBe(newProduct.name);
        expect(postBody.hasPriceGreaterThanZero()).toBeTruthy();
        IdProducto = postBody.id;
        console.log(IdProducto);
        });

        await test.step('GET - Verificar la creación', async () => {
        const getResponse = await productService.getProduct(IdProducto);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.id).toBe(IdProducto);
        expect(getResponse.body.name).toBe(newProduct.name);
        });

        await test.step('Generar la actualización del producto', async () => {
        updateProduct = new ProductRequest('MacOS', {
          year: 2026,
          price: 3500.20,
          'CPU model': 'IOS 14',
          'Hard disk size': '3 TB',
        });
        });

        await test.step('PUT - Reemplazar el producto completo', async () => {
        const updateResponse = await productService.updateProduct(`${IdProducto}`,updateProduct);
        updateStatus = updateResponse.status;
        updateBody = updateResponse.body;
        });

        await test.step('Validar la actualización', async () => {
        expect(updateStatus).toBe(200);
        expect(updateBody.name).toBe(updateProduct.name);
        console.log(`Nombre actualizado del producto: ${updateBody.name}`);
        });

        await test.step('Verificar el reemplazo total', async () => {
        const getNewResponse = await productService.getProduct(IdProducto);
        expect(getNewResponse.status).toBe(200);
        expect(getNewResponse.body.id).toBe(IdProducto);
        expect(getNewResponse.body.name).toBe(updateProduct.name);
        expect(getNewResponse.body.data.price).toBe(updateProduct.data.price);
        console.log("Datos actualizados: ",getNewResponse.body.data);
        });

        await test.step('PATCH - Actualizar parcialmente el precio', async () => {
        const patchResponse = await productService.patchProduct(`${IdProducto}`,{
            data:{
                price: 4000.00
            }
        });
        patchStatus = patchResponse.status;
        patchBody = patchResponse.body;
        });

        await test.step('Validar la actualización parcial', async () => {
        expect(patchStatus).toBe(200);
        expect(patchBody.data.price).toBe(4000.00);
        });

        await test.step('GET - Verificar que solo el precio cambió', async () => {
        const getNewResponse2 = await productService.getProduct(IdProducto);
        expect(getNewResponse2.status).toBe(200);
        expect(getNewResponse2.body.id).toBe(IdProducto);
        expect(patchBody.data.price).toBe(4000.00);
        console.log("Datos actualizados: ",getNewResponse2.body.data);
        });

        await test.step('PUT - Reemplazo con datos invalidos - status 200', async () => {
        updateProduct2 = new ProductRequest(520, {
          year: "2026",
          price: "3500.20",
          'CPU model': 15,
          'Hard disk size': 3,
        });
        const updateResponse = await productService.updateProduct(`${IdProducto}`,updateProduct2);
        updateStatus2 = updateResponse.status;
        updateBody2 = updateResponse.body;
        expect(updateStatus2).toBe(200);
        });
    })

    test.describe('DELETE /objects', () => {

    test.skip('DELETE - Eliminar producto creado', async ({ request }) => {
      // implementación no realizada para el endpoint
    });
  });




});