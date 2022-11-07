var collection = null;

const search = () => {
    var keyword = document.getElementById('textbox').value;
    const database = new Database('https://raw.githubusercontent.com/sleeparalysis/ygocards/main/data/cardinfo.json');
    database.search(keyword)
}

const getInfo = (id) => {
    const imgelement = document.getElementById('image');
    var imgHTMLString = `<img id="${collection.card(id).id}" class="card" src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards/${collection.card(id).id}.jpg" loading="eager"/>`;
    imgelement.innerHTML = imgHTMLString;

    nameHTML = `<h3>${collection.card(id).name}</h3>`;
    typeHTML = `<p><span class="bold">[${collection.card(id).race} / ${collection.card(id).type}]</span></p>`;
    descHTML = `<p>${collection.card(id).desc}</p>`;
    lineHTML =  `<hr class="solid">`;

    if(collection.card(id).level != null) {
        levelHTML= `<p class="space center">${collection.card(id).stars}</p>`;
    }
    else {
        levelHTML = ``;
    }

    if(collection.card(id).atk != null) {
        atkHTML = `<span class=" right bold">ATK/${collection.card(id).atk}</span>`;
    }
    else {
        atkHTML = ``;
    }

    if(collection.card(id).def != null) {
        defHTML = `<span class="right bold">DEF/${collection.card(id).def}</span>`;
    }
    else {
        defHTML = ``;
    }

    if(collection.card(id).linkval != null) {
        linkHTML = `<span class="right bold">LINK-${collection.card(id).linkval}</span>`;
    }
    else {
        linkHTML = ``;
    }

    const infoelement = document.getElementById('info');
    var infoHTMLString = `<div class="info">`;
    infoHTMLString +=
        nameHTML + 
        levelHTML +
        lineHTML +
        typeHTML +
        descHTML +
        lineHTML +
        defHTML +
        linkHTML +
        atkHTML;
    infoHTMLString += `</div>`;    
    infoelement.innerHTML = infoHTMLString;
}

class Card {
    constructor(data) {
        this.id = data.id,
        this.name = data.name,
        this.type = data.type.replace(' Monster', ''),
        this.desc = data.desc,
        this.atk = data.atk,
        this.def = data.def,
        this.level = data.level,
        this.stars = String('&#9733;').repeat(data.level),
        this.race = data.race,
        this.attribute = data.attribute,
        this.archetype = data.archetype,
        this.linkval = data.linkval,
        this.sets = data.card_sets,
        this.image = data.card_images[0].image_url,
        this.thumbnail = data.card_images[0].image_url_small,
        this.prices = data.card_prices
    }
}

class Collection {
    constructor() { this.cards = []; }
    get collection() { return this.cards; }

    push(card) {
        this.cards.push(card);
    }

    card(id) {
        for(let i = 0; i < this.collection.length; i++) {
            if(this.collection[i].id == id) { return this.collection[i]; }
        }
    }

    displayCards = (elementID) => {
        const info = document.getElementById(elementID);
        var HTMLString = this.cards.map(card => `<img id="${card.id}" class="card_small" src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards_small/${card.id}.jpg" loading="lazy" onclick="getInfo(this.id)"/>`).join('');
        info.innerHTML = HTMLString;
    }
}

class Database {
    constructor(url) {
        this.url = url;
    }

    search = (keyword) => {
        var keyword = document.getElementById('textbox').value;
        collection = new Collection();
            
        fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                for(let i = 0; i < data.data.length; i++) {
                    if(this.containsKeyword(keyword, data.data[i])) {
                        const card = new Card(data.data[i]);
                        collection.push(card);
                        
                    }
                }
                collection.displayCards('gallery');
                collection.open('gallery');
            }
        );
    }

    containsKeyword = (keyword, data) => {
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

    update = (url, filename) => {
        for(let i = 0; i < url.length; i++) {
            fetch(url[i][0])
                .then((res) => res.blob())
                .then((data) => {
                    var a = document.createElement('a');
                    a.href = window.URL.createObjectURL(data);
                    a.download = filename;
                    a.click();
                }
            );
        }
    }
}

class Display {
    constructor() {

    }


}

