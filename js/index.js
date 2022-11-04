const min = 1;
const max = 5;
var current = 0;

const getInput = () => {
    var search = document.getElementById('textbox').value;
    fetchCard(search);
}

const insertImage = (id) => {
    const element = document.getElementById('image');
    var HTMLString = `
        <img id="${id}" class="card" src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards/${id}.jpg"/>
        `;
    element.innerHTML = HTMLString;
}

const add = () => {
    if(current < 5) {
        current++;
        document.getElementById('gallery').style.height = `calc((85px * ${current} - 5px)`;
    } 
}

const sub = () => {
    if(current > 1) {
        current--;
        document.getElementById('gallery').style.height = `calc((85px * ${current} - 5px)`;
    } 
}

const openresults = () => {
    document.getElementById('resize').style.display = 'flex';
    document.getElementById('gallery').style.display = 'flex';
    add();
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

            <p class="space"><span class="bold">Type:</span> ${data.type}</p>
            <p><span class="bold">Race:</span> ${data.race}</p>
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

const fetchCard = (search) => {
    fetch('../js/cardinfo.json')
        .then((res) => res.json())
        .then((data) => {
            var cards = [];

            for(let i = 0; i < data.data.length; i++) {
                if(
                    data.data[i].name.toLowerCase().match(search.toLowerCase()) ||
                    data.data[i].type.toLowerCase().match(search.toLowerCase()) ||
                    data.data[i].desc.toLowerCase().match(search.toLowerCase()) ||
                    (data.data[i].archtype != null && data.data[i].archetype.toLowerCase().match(search.toLowerCase())) ||
                    (data.data[i].race != null && data.data[i].race.toLowerCase().match(search.toLowerCase())) ||
                    (data.data[i].attribute != null && data.data[i].attribute.toLowerCase().match(search.toLowerCase()))
                ){
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

                    cards.push(card);
                }
            }

            
            displayCards(cards);
        }
    );
}


const displayCards = (cards) => {
    const info = document.getElementById('gallery');
    var HTMLString = cards.map(selected =>
        `
             <img id="${selected.id}" class="card_small" src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards_small/${selected.id}.jpg" loading="lazy" onclick="getInfo(this.id)"/>
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