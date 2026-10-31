const numeros: number[] = [1, 2, 3, 4, 5];

console.log(numeros.map(n => n * 2));

const nombres: string[] = ['Bruno', 'Martín', 'Pepe', 'Alejo'];
let usuarios = [];

usuarios = nombres.map((nombre, indice) => ({id: indice + 1, nombre: nombre}));

console.log(usuarios);