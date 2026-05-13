import { faker } from "@faker-js/faker";

function generarUsuario(){
    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: `Test${faker.number.int(99999)}`,
        avatar: faker.image.urlPicsumPhotos()
    };
}

function generarCategoria(){
    return {
        name: faker.commerce.department(),
        image: faker.image.url()
    };
}

function generarProducto(){
    return {
        title: faker.commerce.productName(),
        price: Number(faker.commerce.price({min:10, max: 200})),
        description: faker.commerce.productDescription(),
        images: [faker.image.url()]
    };
}

module.exports = {generarUsuario, generarCategoria, generarProducto};