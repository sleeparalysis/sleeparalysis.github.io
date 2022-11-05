const min_row = 1;
const max_row = 8;
var current_row = 1;
var number_of_results = 0;

const search = () => {
    var search = document.getElementById('textbox').value;
    fetch('../js/cardinfo.json')
        .then((res) => res.json())
        .then((data) => {
            var cards = [];
            for(let i = 0; i < data.data.length; i++) {
                if(isValid(data.data[i], search)) {
                    max = data.data.lenth;
                    cards.push(data.data[i].id)
                }
            }
            displayCards(cards);
        }
    );
}

const insertImage = (id) => {
    const element = document.getElementById('image');
    var HTMLString = `
        <img id="${id}" class="card" src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards/${id}.jpg"/>
        `;
    element.innerHTML = HTMLString;
}

const add = () => {
    if(current_row < max_row) {
        current_row++;
        document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
    } 
}

const sub = () => {
    if(current_row > min_row) {
        current_row--;
        document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
    } 
}

const openresults = () => {
    document.getElementById('resize').style.display = 'flex';
    document.getElementById('gallery').style.display = 'flex';
}

const closeresults = () => {
    document.getElementById('resize').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
}

const insertInfo = (data) => {
    const element = document.getElementById('info');
    var HTMLString = `
        <div class="info">
            <h2>${data.name}</h2>
            <p><span class="bold">Description</span></p>
            <p>${data.desc}</p>

            <p class="space"><span class="bold">Level:</span> ${data.level}</p>
            <p><span class="bold">Attack:</span> ${data.atk}</p>
            <p><span class="bold">Defense:</span> ${data.def}</p>
            <p><span class="bold">Link Rating:</span> ${data.linkval}</p>

            <p class="space"><span class="bold">Card Type:</span> ${data.type}</p>
            <p><span class="bold">Type:</span> ${data.race}</p>
            <p><span class="bold">Attribute:</span> ${data.attribute}</p>
            <p><span class="bold">Archetype:</span> ${data.archetype}</p>
            
        </div>
        `;
    element.innerHTML = HTMLString;
}

const getInfo = (id) => {
    fetch('../js/cardinfo.json')
        .then((res) => res.json())
        .then((data) => {
            for(let i = 0; i < data.data.length; i++) {
                if(String(data.data[i].id).match(String(id))) {
                    insertImage(data.data[i].id) 
                    insertInfo(data.data[i]);
                    document.getElementById('container').style.gap = '25px';
                    document.getElementById('infocol').style.visibility = 'visible';
                    break;
                }
            }
        }
    );
}

const isValid = (data, search) => {
    if(data.name.toLowerCase().match(search.toLowerCase()) ||
        data.type.toLowerCase().match(search.toLowerCase()) ||
        data.desc.toLowerCase().match(search.toLowerCase()) ||
        (data.archetype != null && data.archetype.toLowerCase().match(search.toLowerCase())) ||
        (data.race != null && data.race.toLowerCase().match(search.toLowerCase())) ||
        (data.attribute != null && data.attribute.toLowerCase().match(search.toLowerCase()))
    ) { 
        return true;
    }
    return false;
}

const createCard = (data) => {
    const card = {
        id: data.data[i].id,
        name: data.data[i].name,
        type: data.data[i].type,
        desc: data.data[i].desc,
        atk: data.data[i].atk,
        def: data.data[i].def,
        level: data.data[i].level,
        race: data.data[i].race,
        attribute: data.data[i].attribute,
        archetype: data.data[i].archetype,
        linkval: data.data[i].linkval,
        card_sets: data.data[i].card_sets,
        image_url: data.data[i].card_images[0].image_url,
        image_url_small: data.data[i].card_images[0].image_url_small,
        card_prices: data.data[i].card_prices
    }
}


const displayCards = (cards) => {
    const info = document.getElementById('gallery');
    var HTMLString = cards.map(id =>
        `
             <img id="${id}" class="card_small" src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards_small/${id}.jpg" loading="lazy" onclick="getInfo(this.id)"/>
        `
    ).join('');
    
    info.innerHTML = HTMLString;
    openresults();
}

const getDatabase = () => {
    const url =
    [
        [`https://db.ygoprodeck.com/api/v7/cardinfo.php`, `cardinfo`],
        [`https://db.ygoprodeck.com/api/v7/cardsets.php`, `cardsets`],
        [`https://db.ygoprodeck.com/api/v7/archetypes.php`, `archetypes`],
        [`https://db.ygoprodeck.com/api/v7/checkDBVer.php`, `version`]
    ];

    for(let i = 0; i < url.length; i++) {
        fetch(url[i][0])
            .then((res) => res.blob())
            .then((data) => {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(data);
                a.download = url[i][1];
                a.click();
            }
        );
    }
}