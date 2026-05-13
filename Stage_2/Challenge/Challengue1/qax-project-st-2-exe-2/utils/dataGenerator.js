import { faker } from "@faker-js/faker";

function generarUsuario() {
    return {
        name: faker.person.fullName(),
        // Agregamos .toLowerCase() para evitar conflictos con la API
        email: faker.internet.username().toLowerCase(), 
        password: faker.internet.password() + 'A1!',
        nuevaPassword: faker.internet.password() + 'B2*' 
    };
}

// Exportamos la función para poder usarla en nuestros tests
module.exports = { generarUsuario };