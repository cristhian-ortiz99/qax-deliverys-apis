import { test, expect } from '@playwright/test';
import { generarUsuario, generarCategoria, generarProducto} from '../utils/dataGenerator';



test.describe.serial('Flujo principal E2E FakePlatzi', () => {
    
    let idCategoria;
    let idProducto;
    let token;
    let tokenRefresh;
    let user1;
    let categoria1;
    let producto1;

    test.beforeAll(async () => {
        user1 = generarUsuario();
        categoria1 = generarCategoria();
        producto1 = generarProducto();
    })

    test('Paso 1: Crear usuario', async ({ request }) => {
        
        const resRegistro = await request.post('users/', {
            data: {
                name: user1.name,
                email: user1.email,
                password: user1.password,
                avatar: user1.avatar
            }
        });
        expect(resRegistro.status()).toBe(201);
        const bodyRegistro = await resRegistro.json();


        console.log(bodyRegistro.id);
        console.log(`✅ Usuario registrado: "${bodyRegistro.name}"`);
    });

    test('Paso 2: Login - obtener token', async ({ request }) => {
        
        const resLogin = await request.post('auth/login', {
            data: {
                email: user1.email,
                password: user1.password
            }
        });
        expect(resLogin.status()).toBe(201);
        const bodyLogin = await resLogin.json();
        token = bodyLogin.access_token;
        console.log(bodyLogin.access_token);
        console.log("✅ Token obtenido");
    });

    test('Paso 3: Crear Categoria', async ({ request }) => {
        
        const res = await request.post('categories/', {
            data: {
                name: categoria1.name,
                image: categoria1.image
            }
        });
        expect(res.status()).toBe(201);
        const bodyRes = await res.json();
        idCategoria = bodyRes.id;

        console.log(bodyRes.id);
        console.log(`✅ Categoria generada: ${bodyRes.name}`);
    });

    test('Paso 4: Crear Producto', async ({ request }) => {
        
        const res = await request.post('products/', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                title: producto1.title,
                price: producto1.price,
                description: producto1.description,
                categoryId: idCategoria,
                images: producto1.images
            }
        });
        expect(res.status()).toBe(201);
        const bodyRes = await res.json();
        idProducto = bodyRes.id;

        console.log(`✅ ID Producto: ${bodyRes.id}`);
        console.log(`✅ Categoria asignada al producto: ${bodyRes.category.id}`);
        console.log(`✅ Producto generado: ${bodyRes.title}`);
    });

    test('Paso 5: Consultar producto creado', async ({ request }) => {
        
        const res = await request.get(`products/${idProducto}/`);
        expect(res.status()).toBe(200);
        const bodyRes = await res.json();

        console.log("✅ Producto encontrado");
        console.log(bodyRes.id);
        console.log(`✅ Producto: ${bodyRes.title}`);
    });
})

test.describe('Casos de prueba en base a criterios de aceptacion', () =>{

    let user2;

    test.beforeAll(async () => {
            user2 = generarUsuario();
    })
    
    test('CP01: Obtener información del usuario', async ({ request }) => {
        
        
        const resRegistro = await request.post('users/', {
            data: {
                name: user2.name,
                email: user2.email,
                password: user2.password,
                avatar: user2.avatar
            }
        });
        expect(resRegistro.status()).toBe(201);
        const bodyRegistro = await resRegistro.json();

        console.log(bodyRegistro.id);
        console.log(`✅ Usuario registrado: "${bodyRegistro.name}"`);

        const resLogin = await request.post('auth/login', {
            data: {
                email: user2.email,
                password: user2.password
            }
        });
        expect(resLogin.status()).toBe(201);
        const bodyLogin = await resLogin.json();
        let token = bodyLogin.access_token;

        //obtener información de usuario
        const res = await request.get('auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log(`✅ Usuario obtenido: "${body.name}"`);
    });

    test('CP02: Encontrar usuario creado en la lista', async ({ request }) => {
        
        const user3 = generarUsuario();

        const resRegistro = await request.post('users/', {
            data: {
                name: user3.name,
                email: user3.email,
                password: user3.password,
                avatar: user3.avatar
            }
        });
        expect(resRegistro.status()).toBe(201);
        const bodyRegistro = await resRegistro.json();

        console.log(bodyRegistro.id);
        console.log(`✅ Usuario registrado: "${bodyRegistro.name}"`);

        const res = await request.get('users/');
        expect(res.status()).toBe(200);
        const body = await res.json();
        const usuarioEncontrado = body.find(
            p => p.id === bodyRegistro.id
        );

        expect(usuarioEncontrado).toBeTruthy();
        console.log(`✅ Usuario encontrado: ${usuarioEncontrado.name}`);
    });


    test('CP03: Consultar categoria creada', async ({ request }) => {
        
        const categoria2 = generarCategoria();

        const res = await request.post('categories/', {
            data: {
                name: categoria2.name,
                image: categoria2.image
            }
        });
        expect(res.status()).toBe(201);
        const bodyRes = await res.json();
        let idCategoria = bodyRes.id;

        console.log(bodyRes.id);
        console.log(`✅ Categoria generada: ${bodyRes.name}`);
        
        //consultar categoria con GET

        const resCons = await request.get(`categories/${idCategoria}`);
        expect(resCons.status()).toBe(200);
        const bodyResc = await resCons.json();
        console.log("✅ Categoria encontrada");
        console.log(bodyResc.id);
        console.log(bodyResc.name);

    });

    test('CP04: Consultar categoria creada en lista de categorias', async ({ request }) => {
        
        const categoria3 = generarCategoria();

        const res = await request.post('categories/', {
            data: {
                name: categoria3.name,
                image: categoria3.image
            }
        });
        expect(res.status()).toBe(201);
        const bodyRes = await res.json();
        let idCategoria = bodyRes.id;

        console.log(bodyRes.id);
        console.log(`✅ Categoria generada: ${bodyRes.name}`);
        
        //consultar categoria con GET

        const resCons = await request.get("categories/");
        expect(resCons.status()).toBe(200);
        const bodyResc = await resCons.json();
        const categoriaEncontrada = bodyResc.find(
            p => p.id === bodyRes.id
        );
        expect(categoriaEncontrada).toBeTruthy();
        console.log(`✅ Categoria encontrada: ${categoriaEncontrada.name}`);

    });

    test('CP05: Consultar productos en lista de productos, asociados a una categoria', async ({ request }) => {
        
        const categoria4 = generarCategoria();
        const producto2 = generarProducto();

        const res = await request.post('categories/', {
            data: {
                name: categoria4.name,
                image: categoria4.image
            }
        });
        expect(res.status()).toBe(201);
        const bodyRes = await res.json();
        let idCategoria = bodyRes.id;

        console.log(bodyRes.id);
        console.log(`✅ Categoria generada: ${bodyRes.name}`);
        
        //Generar producto con la categoria generada
        const resProd = await request.post('products/', {
            data: {
                title: producto2.title,
                price: producto2.price,
                description: producto2.description,
                categoryId: idCategoria,
                images: producto2.images
            }
        });
        expect(resProd.status()).toBe(201);
        const bodyProd = await resProd.json();

        console.log(`✅ ID Producto: ${bodyProd.id}`);
        console.log(`✅ Categoria asignada al producto: ${bodyProd.category.id}`);
        console.log(`✅ Producto generado: ${bodyProd.title}`);

        //Buscar producto generado en la lista de productos

        const resCons = await request.get("products/");
        expect(resCons.status()).toBe(200);
        const bodyResc = await resCons.json();
        const productoEncontrado = bodyResc.find(
            p => p.id === bodyProd.id
        );
        expect(productoEncontrado).toBeTruthy();
        console.log(`✅ Producto encontrado: ${productoEncontrado.title}`);

    });


})
