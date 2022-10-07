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
            id: String(data.id).padStart(3, '0'),
            name: data.name,
            height: data.height,
            weight: data.weight,
            exp: data.base_experience,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            sp_attack: data.stats[3].base_stat,
            sp_defense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
            image: data.sprites.versions['generation-v']['black-white']['animated']['front_default'],
            type: data.types.map((type) => type.type.name)
        }));
        
        
        displayPokemon(pokemon);
    });    
}

fetchPokemon();


const displayPokemon = (pokemon) => {
    var pokemonHTMLString = pokemon.map(selected =>
        `
        <li class="card-outer">
            <div class="card-inner ${selected.type[0]}">
                <div class="top">
                    <p class="name">${selected.name}</p>
                    <div class="hp">
                        <p class="text">HP</p>
                        <p class="number">${selected.hp}</p>
                    </div>
                </div>
                <div class="middle">
                    <img src="${selected.image}" loading="lazy"/>
                </div>
                <div class="bottom">
                    <div class="row">
                        <p class="name">Attack</p>
                        <p class="number">${selected.attack}</p>
                    </div>
                    <div class="row line">
                        <p class="name">Defense</p>
                        <p class="number">${selected.defense}</p>
                    </div>
                    <div class="row">
                        <p class="name">Sp. Attack</p>
                        <p class="number">${selected.sp_attack}</p>
                    </div>
                    <div class="row">
                        <p class="name">Sp. Defense</p>
                        <p class="number">${selected.sp_defense}</p>
                    </div>
                    <div class="row">
                        <p class="name">Speed</p>
                        <p class="number">${selected.speed}</p>
                    </div>
                </div>
            </div>
        </li>
        `
    ).join('');

    info.innerHTML = pokemonHTMLString;
}


const typeNumber = (selected) => {
    
    

    var typeHTML = ``;
    selected.type.forEach( element => {
        typeHTML += `
                <p class="type ${element}">${element}</p>
        `;
    })

    return typeHTML;
}