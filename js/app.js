/*const pokemonLocal = [

  { nombre: "bulbasaur",  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",  tipos: ["grass", "poison"] },
  { nombre: "charmander", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",  tipos: ["fire"] },
  { nombre: "squirtle",   imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",  tipos: ["water"] },
  { 
*/
const contenedor = document.getElementById("resultado");

function crearTarjeta(pokemon) {
    let {nombre, imagen, tipos}= pokemon
  const articulo = document.createElement("article");   // crea el nodo <article>
  const badges = tipos
  .map(function (tipo) {
    return `<span class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">${tipo}</span>`;
  })
  .join("");   // une el array de stringso
  articulo.className = "bg-white rounded-xl shadow p-4 text-center";
  articulo.innerHTML = `
    <img src="${imagen}" alt="${nombre}" class="w-24 h-24 mx-auto">
    <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
   <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
    `;
  return articulo;
}

function render(lista) {
  contenedor.innerHTML = "";                 // 1. limpia lo anterior
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);   // 2. crea el nodo
    contenedor.appendChild(tarjeta);         // 3. lo inserta en el DOM
  });
}

//render(pokemonLocal);   // ¡píntalo!

contenedor.innerHTML = `<p class="col-span-full text-center text-slate-500">Cargando…</p>`


const buscador = document.getElementById("buscador");

buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokemonLocal.filter(p => p.nombre.includes(texto));
  render(filtrados);   // ← el MISMO render, con datos distintos
});

function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen: data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos:  data.types.map(t => t.type.name)   // [{type:{name:"electric"}}] → ["electric"]
  };
}
const nombres = ["bulbasaur", "charmander", "squirtle", "pikachu", "jigglypuff", "gengar"];
let pokedex = [];   // aquí guarda
// un fetch por  de promesas
const promesas = nombres.map(function (nombre) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`).then(r => r.json());
});

Promise.all(promesas)
  .then(function (datos) {                 // datos = array con los 6 Pokémon crudos
    pokedex = datos.map(adaptarPokemon);   // adapta todos a tu forma limpia
    render(pokedex);
  })
  .catch(function () {
    contenedor.innerHTML = `<p class="col-span-full text-center text-red-600">No se pudo cargar la Pokédex.</p>`;
  });

  //hhhhh


  