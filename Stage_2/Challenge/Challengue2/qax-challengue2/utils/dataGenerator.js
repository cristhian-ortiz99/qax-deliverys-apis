import { faker } from "@faker-js/faker";

function generarUsuario(){
    return {
        username: faker.internet.username().toLowerCase(),
        password: faker.internet.password() + 'A1*'
    };
}

module.exports = {generarUsuario};