const pokedex = document.getElementById('pokedex');

const fetchPokemon = () => {
    const promises = [];
    for(let i = 1; i <= 649; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then( (res) => res.json()));
    }

    Promise.all(promises).then( (results) => {
        var shiny = document.getElementsByName('color');
        var color = '';
        for(let i = 0; i < shiny.length; i++) {
            if(shiny[i].checked) {
                color = shiny[i].value;
            }
        }

        const pokemon = results.map( (data) => ({
            id: data.id,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            type: data.types.map((type) => type.type.name).join(),
            image: data.sprites.versions['generation-v']['black-white']['animated'][color]
        }));

        displayPokemon(pokemon);
    });    
}

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon.map(pokemen => `
        <li class="pokemon">
            <img src="${pokemen.image}" loading="lazy"/>
            <p>${pokemen.name}</p>
        </li>
    `).join('');
    pokedex.innerHTML = pokemonHTMLString;
}