const Module = require("node:module");

function generarEmailAleatorio() {
    const valor = Date.now(); 
    return `cristhian_${valor}@gmail.com`;
}


module.exports =  {generarEmailAleatorio};