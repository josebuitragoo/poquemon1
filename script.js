const container = document.getElementById("cardsContainer");
const filter = document.getElementById("pokemonFilter");
const siteTitle = document.getElementById("siteTitle");
const inicioBtn = document.getElementById("inicioBtn");

let allPokemons = [];
let evolutionChains = [];
let evolutionStarters = [];

async function fetchPokemons() {
  const promises = [];
  for (let i = 1; i <= 15; i++) {
    promises.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json())
    );
  }
  allPokemons = await Promise.all(promises);
  await loadEvolutionData();
  renderCards(allPokemons);
  fillFilter(allPokemons);
  renderSidebar();
}

function getEmojiByType(type) {
  const typeEmojis = {
    fire: "🔥",
    water: "💧",
    grass: "🌿",
    electric: "⚡",
    normal: "✨",
    poison: "☠️",
    bug: "🐛",
    ground: "🌍",
    flying: "🕊️",
    psychic: "🔮",
    rock: "🪨",
    ice: "❄️",
    dragon: "🐉",
    dark: "🌑",
    steel: "⚙️",
    fairy: "🧚",
  };
  return typeEmojis[type] || "❓";
}

function renderCards(pokemons) {
  container.innerHTML = "";
  pokemons.forEach((pokemon) => {
    const abilities = pokemon.abilities
      .map(
        (a) => `
      <div class="icon-box">
        <span>${a.ability.name}</span>
      </div>`
      )
      .join("");

    const mainType = pokemon.types[0]?.type.name;

    const card = document.createElement("div");
    card.classList.add("card", mainType);

    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <p>Habilidades:</p>
      ${abilities}
      <div class="type-emoji">${getEmojiByType(mainType)}</div>
      <div class="type-label">${mainType.toUpperCase()}</div>
    `;

    container.appendChild(card);
  });
}
function fillFilter(pokemons) {
  pokemons.forEach((pokemon) => {
    const option = document.createElement("option");
    option.value = pokemon.name;
    option.textContent = pokemon.name.toUpperCase();
    filter.appendChild(option);
  });
}

async function loadEvolutionData() {
  const evoGroups = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
  ];
  evolutionChains = evoGroups.map((group) =>
    allPokemons.filter((p) => group.includes(p.id))
  );
  evolutionStarters = evolutionChains.map((group) => group[0]);
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";
  evolutionStarters.forEach((starter) => {
    const img = document.createElement("img");
    img.src = starter.sprites.front_default;
    img.alt = starter.name;
    img.title = starter.name.toUpperCase();
    img.classList.add("sidebar-img");
    img.addEventListener("click", () => showEvolutionGroup(starter.id));
    sidebar.appendChild(img);
  });
}

function showEvolutionGroup(pokemonId) {
  const group = evolutionChains.find((chain) =>
    chain.some((p) => p.id === pokemonId)
  );
  if (group) {
    renderCards(group);
  } else {
    const single = allPokemons.find((p) => p.id === pokemonId);
    renderCards([single]);
  }
}

document.getElementById("inicioBtn").addEventListener("click", () => {
  filter.value = "all"; // Resetear el filtro a "Todos"
  renderCards(allPokemons); // Restaurar todas las cartas
});


filter.addEventListener("change", (e) => {
  const selected = e.target.value;
  if (selected === "all") {
    renderCards(allPokemons);
  } else {
    const filtered = allPokemons.filter((p) => p.name === selected);
    renderCards(filtered);
  }
});

document.querySelector('header h1').addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Desplazamiento suave hacia el inicio
  });
});

siteTitle.addEventListener("click", () => renderCards(allPokemons));
inicioBtn.addEventListener("click", () => renderCards(allPokemons));

window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("startOverlay");
  const startButton = document.getElementById("startButton");
  const audio = document.getElementById("bg-music");

  startButton.addEventListener("click", () => {
    audio.play();
    overlay.style.display = "none";
  });
});



fetchPokemons();

