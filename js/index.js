const min_row = 1;
const max_row = 8;
var total_rows = 0;
var current_row = 1;
var minimized = false;

const add = () => {
    var temp_max = 0;
    if(total_rows < max_row) {
        temp_max = total_rows;
        if (current_row < temp_max) {
            current_row++;
        }
    }
    else {
        if (current_row < max_row) {
            current_row++;
        }
    }

    document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
}


const sub = () => {
    if(current_row > min_row) { current_row--; }
    document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
}

const resize = () => {
    while(total_rows < current_row) { current_row--; }
    document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
}



const minimize = () => {
    document.getElementById('resize').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
}

const getTotalRows = (items) => {
    total_rows = Math.ceil(items / 8);
}

const openresults = () => {
    document.getElementById('gallery').style.display = 'flex';
    document.getElementById('imagecol').style.display = 'flex';
}
const containsKeyword = (keyword, data) => {
    if(data.name.toLowerCase().match(keyword.toLowerCase()) ||
        data.type.toLowerCase().match(keyword.toLowerCase()) ||
        data.desc.toLowerCase().match(keyword.toLowerCase()) ||
        (data.archetype != null && data.archetype.toLowerCase().match(keyword.toLowerCase())) ||
        (data.race != null && data.race.toLowerCase().match(keyword.toLowerCase())) ||
        (data.attribute != null && data.attribute.toLowerCase().match(keyword.toLowerCase())))
    { 
        return true;
    }

    return false;
}

const search = () => {
    var keyword = document.getElementById('textbox').value;
    fetch('https://raw.githubusercontent.com/sleeparalysis/ygocards/main/data/cardinfo.json')
        .then((res) => res.json())
        .then((data) => {
            var cards = [];
            for(let i = 0; i < data.data.length; i++) {
                if(containsKeyword(keyword, data.data[i])) {
                    cards.push(data.data[i].id)
                }
            }
            displayCards(cards);
            openresults();
        }
    );
}

const insertImage = (id) => {
    const element = document.getElementById('image');
    var HTMLString = `
        <img
            id="${id}"
            class="card"
            src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards/${id}.jpg"
            loading="eager"
        />`;
    element.innerHTML = HTMLString;
}

const insertInfo = (card) => {
    const element = document.getElementById('info');

    var HTMLString = `
        <div class="info">
            <h2>${card.name}</h2>
            <p><span class="bold">Description</span></p>
            <p>${card.desc}</p>
        </div>`;

    element.innerHTML = HTMLString;
}

const getInfo = (id) => {
    fetch('https://raw.githubusercontent.com/sleeparalysis/ygocards/main/data/cardinfo.json')
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

const displayCards = (cards) => {
    const info = document.getElementById('gallery');
    var HTMLString = cards.map(id => `
        <img 
            id="${id}"
            class="card_small"
            src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards_small/${id}.jpg"
            loading="lazy"
            onclick="getInfo(this.id)"/>`)
            .join('');
    info.innerHTML = HTMLString;
}

const getDatabase = () => {
    const url = [
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

    return card;
}


