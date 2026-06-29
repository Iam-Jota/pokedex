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
  .map(function (tipo) { return `<span class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">${tipo}</span>`;
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

function render(arrayPokemon) {
  contenedor.innerHTML = "";                 // 1. limpia lo anterior
  arrayPokemon.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);   // 2. crea el nodo
    contenedor.appendChild(tarjeta);         // 3. lo inserta en el DOM
  });
}

//render(pokemonLocal);   // ¡píntalo!



function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen: data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos:  data.types.map(t => t.type.name),
    stats:  data.stats.map(s => ({ nombre: s.stat.name, valor: s.base_stat }))   // ← nuevo
    // data.stats = [{ base_stat: 35, stat: { name: "hp" } }, ...]
  };
}
  contenedor.innerHTML = `<p class="col-span-full text-center text-red-600">No se pudo cargar la Pokédex.</p>`;
  

let pokedex = [];   // aquí


async function obtenerPokemon(idONombre) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idONombre}`);
  return response.json();
}

async function cargarPokedex() {
  const nombres = ["bulbasaur", "charmander", "squirtle", "pikachu", "jigglypuff", "gengar"];
  const datos = await Promise.all(nombres.map(obtenerPokemon));   // varios en paralelo, con await
  pokedex = datos.map(adaptarPokemon);
  render(pokedex);
}

cargarPokedex();


const buscador = document.getElementById("buscador");

const boton = document.getElementById("btn-buscar"); 

/*buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokedex.filter(p => p.nombre.includes(texto));   // antes: pokemonLocal
  render(filtrados);
});*/

/*

buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokemonLocal.filter(p => p.nombre.includes(texto));
  render(filtrados);   // ← el MISMO render, con datos distintos
});*/


async function buscarPokemon(nombre) {
  const data = await obtenerPokemon(nombre.toLowerCase());   // reusa obtenerPokemon de HU1
  return adaptarPokemon(data);
}

function capturar(pokemon) {
  if (!pokedex.some(p => p.nombre === pokemon.nombre)) {
    pokedex.push(pokemon);   // hace crecer tu colección
  }
  render(pokedex);           // vuelve la colección completa, ya con el nuevo
 buscador.value = "";
}


// muestra la tarjedo
function mostrarResultado(pokemon) {
 contenedor.innerHTML = "";
 // contenedor.appendChild(crearTapokemon));
const tarjeta = crearTarjeta(pokemon);


  // estadísticas (solo en el resultado de búsqueda)
  const stats = document.createElement("div");
  stats.className = "mt-2 text-left text-xs space-y-1";
  stats.innerHTML = pokemon.stats.map(s => `
    <div class="flex justify-between"><span class="capitalize">${s.nombre}</span><span class="font-semibold">${s.valor}</span></div>
  `).join("");
  tarjeta.appendChild(stats);

  const boton = document.createElement("button");
  boton.textContent = "⚡ Capturar";
  boton.className = "mt-2 w-full bg-yellow-400 font-semibold rounded-lg py-1 hover:bg-yellow-500";
  boton.addEventListener("click", () => capturar(pokemon));
  tarjeta.appendChild(boton);                       // el botón SOLO en el resultado

  //contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}


async function mostrarBusqueda(nombre) {
  const pokemon = await buscarPokemon(nombre);
  mostrarResultado(pokemon);
}

boton.addEventListener("click", function () {
  const nombre = buscador.value.trim();
  if (nombre !== "") mostrarBusqueda(nombre);
});

// Buscar también con Enter
buscador.addEventListener("keydown", function (event) {
  if (event.key === "Enter") boton.click();
});
  


let offset = 0;   // desde qué Pokémon empezamos

async function cargarMas() {
  // ?limit (cuántos) y ?offset (desde dónde) = parámetros de consulta
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`);
  const lista = await respuesta.json();   // { results: [{ name, url }, ...] }

  // cada item trae solo name + url → pide el detalle de cada uno en paralelo
  const datos = await Promise.all(
    lista.results.map(item => fetch(item.url).then(r => r.json()))
  );

  datos.map(adaptarPokemon).forEach(function (pokemon) {
    if (!pokedex.some(p => p.nombre === pokemon.nombre)) {
      pokedex.push(pokemon);   // sin duplicar
    }
  });

  offset += 12;     // la próxima vez, la siguiente página
  render(pokedex);
}

document.getElementById("cargar-mas").addEventListener("click", cargarMas);
