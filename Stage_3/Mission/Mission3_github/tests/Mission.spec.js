const { test, expect } = require('@playwright/test');
const { RepoService } = require('../src/services/RepoService');
const { UserService } = require('../src/services/UserService');
const { RepoRequest } = require('../src/models/RepoRequest');


test.describe('HU01 — Consultar información de un usuario',() => {

    test('Consultar información de usuario', async({request}) => {
        const userService = new UserService(request);
        
        await test.step('GET - Obtener información de usuario', async () => {
        const getResponse = await userService.getUser();
        expect(getResponse.status).toBe(200);
        console.log(getResponse.body.login);
        });
    })

});

test.describe('HU02 — Repositorios: crear, consultar y actualizar',() => {
    
    let nameRepo;
    let postStatus;
    let postBody;
    let newRepo;

    test('Flujo de creación de un repo', async({request}) => {
        
        const repoService = new RepoService(request);
        
        await test.step('Preparar el repo a crear', async () => {
        newRepo = new RepoRequest('prueba_qax_apis_mi',
            'Repositorio creado desde Postman - Mission #3',
            false,
            true);
        });
        await test.step('POST - Crear el repo', async () => {
            const postResponse = await repoService.createProduct(newRepo);
            postStatus = postResponse.status;
            postBody = postResponse.body;
        });

        await test.step('Validar el status code y el body del response', async () => {
        expect(postStatus).toBe(201);
        expect(postBody.hasValidId()).toBeTruthy();
        nameRepo = postBody.name;
        });

        await test.step('GET - Verificar la creación', async () => {
        const getResponse = await repoService.getProduct(nameRepo);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.name).toBe(newRepo.name);
        console.log(getResponse.body.name);
        });
    });

});