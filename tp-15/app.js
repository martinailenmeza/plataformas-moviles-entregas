document.addEventListener('DOMContentLoaded', () => {
    const pokemonList = document.getElementById('pokemon-list');
    const loadMoreButton = document.getElementById('load-more');
    const loadingSpinner = document.getElementById('loading');
    const pokemonDetails = document.getElementById('pokemon-details');
    const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
    let offset = 0;
    const limit = 20;

    const fetchPokemon = async () => {
        loadingSpinner.style.display = 'block';
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            for (const pokemon of data.results) {
                const pokemonData = await fetchPokemonData(pokemon.url);
                displayPokemon(pokemonData);
            }
            offset += limit;
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        } finally {
            loadingSpinner.style.display = 'none';
        }
    };

    const fetchPokemonData = async (url) => {
        const response = await fetch(url);
        return response.json();
    };

    const displayPokemon = (pokemon) => {
        const card = document.createElement('div');
        card.classList.add('col-6', 'col-md-4', 'col-lg-3');
        card.innerHTML = `
            <div class="card">
                <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <h5 class="card-title text-center">${pokemon.name}</h5>
                    <p class="card-text">Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                    <button class="btn btn-primary btn-sm w-100" data-id="${pokemon.id}">Más Info</button>
                </div>
            </div>
        `;
        pokemonList.appendChild(card);

        card.querySelector('button').addEventListener('click', () => {
            showPokemonDetails(pokemon);
        });
    };

    const showPokemonDetails = (pokemon) => {
        const details = `
            <h4>${pokemon.name}</h4>
            <p>Tipos: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p>Habilidad: ${pokemon.abilities.length > 0 ? pokemon.abilities[0].ability.name : 'N/A'}</p>
            <p>Movimientos: ${pokemon.moves.length > 0 ? pokemon.moves.slice(0, 4).map(move => move.move.name).join(', ') : 'N/A'}</p>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        `;
        pokemonDetails.innerHTML = details;
        pokemonModal.show();
    };

    loadMoreButton.addEventListener('click', fetchPokemon);

    // Cargar los primeros Pokémon al iniciar
    fetchPokemon();
});
