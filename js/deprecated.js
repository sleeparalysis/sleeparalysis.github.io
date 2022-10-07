const fetchOnePokemon = (i) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`
    fetch(url)
        .then( (res) => {
            return res.json();
        })
        .then( (data) => {
            const pokemon = {};
            pokemon['id'] = String(data.id).padStart(3, '0');
            pokemon['name'] = data.name;
            pokemon['height'] = data.height;
            pokemon['weight'] = data.weight;
            pokemon['exp'] = data.base_experience;
            pokemon['hp'] = data.stats[0].base_stat;
            pokemon['attack'] = data.stats[1].base_stat;
            pokemon['defense'] = data.stats[2].base_stat;
            pokemon['sp_attack'] = data.stats[3].base_stat;
            pokemon['sp_defense'] = data.stats[4].base_stat;
            pokemon['speed'] = data.stats[5].base_stat;
            pokemon['image'] = data.sprites.versions['generation-v']['black-white']['animated']['front_default'];

            pokemon['type'] = [];
            data.types.forEach( element => {
                pokemon['type'].push(element.type.name);
            });

            displayOnePokemon(pokemon);
        });
}

const displayOnePokemon = (pokemon) => {
    var pokemonHTMLString = ``;
    pokemonHTMLString += `
        <li class="pokemon">
            <p class="number">${pokemon.id}</p>
            <img src="${pokemon.image}" loading="lazy"/>
            <div class="inner-box">
                <p class="name">${pokemon.name}</p>
                <div>
    `;

    pokemon.type.forEach( element => {
        console.log(element);
        pokemonHTMLString += `
                <p class="type ${element}">${element}</p>
        `;
    })

    pokemonHTMLString += `
                </div>
            </div>
        </li>
    `

    info.innerHTML = pokemonHTMLString;
}