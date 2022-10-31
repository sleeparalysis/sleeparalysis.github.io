const info = document.getElementById('info');

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
            id: Number(data.id),
            name: String(data.name).split('-')[0],
            height: data.height,
            weight: data.weight,
            exp: data.base_experience,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            sp_attack: data.stats[3].base_stat,
            sp_defense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
            image: data.sprites.versions['generation-vii']['icons']['front_default'],
            type: data.types.map((type) => type.type.name)
        }));
        
        
        displayPokemonV3(pokemon);
    });    
}

fetchPokemon();


const displayPokemonV3 = (pokemon) => {
    var pokemonHTMLString = pokemon.map(selected =>
        `
            <tr>
                <td class="center">${selected.id}</td>
                <td class="left">${selected.name}</td>
                <td class="center"><img src="${selected.image}"></td>
                <td class="left">${typeNumber(selected)}</td>
                <td class="center">${selected.height}</td>
                <td class="center">${selected.weight}</td>
                <td class="center">${selected.hp}</td>
                <td class="center">${selected.attack}</td>
                <td class="center">${selected.defense}</td>
                <td class="center">${selected.sp_attack}</td>
                <td class="center">${selected.sp_defense}</td>
                <td class="center">${selected.speed}</td>
                <td class="center">${selected.exp}</td>
            </tr>
        `
    ).join('');

    info.innerHTML = pokemonHTMLString;
}


const typeNumber = (selected) => {
    var typeHTML = `<div class="type">`;
    selected.type.forEach( element => {
        typeHTML += `
                <p class="ptype ${element}">${element}<p>
        `;
    })
    typeHTML += `</div`;

    return typeHTML;
}