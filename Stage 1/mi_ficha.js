var nombre = "Cristhian Ortiz";
var edad = 26;
var estudiandoAuto = true;
var hobbies = ["Jugar play", "Jugar Futbol", "Ver series"];

console.log("Mi nombre es",nombre,"tengo", edad,"años, mis hobbies son:",...hobbies,"y me encuentro estudiando Automatización?", estudiandoAuto);

console.log(typeof nombre);
console.log(typeof edad);
console.log(typeof estudiandoAuto);
console.log(typeof hobbies);

const prompt = require("prompt-sync")();

const agregarHobbie = prompt("Cual es su hobbie favorito?:");
hobbies.push(agregarHobbie);

console.log(hobbies);

console.log(hobbies.length);

var nuevaEdad = edad +1;
console.log("Cumplo", nuevaEdad, "el siguiente año");