/*document.addEventListener('contextmenu', event => event.preventDefault());*/

var database = null;

const search = () => {
    var keyword = document.getElementById('textbox').value;
    database = new Database('https://raw.githubusercontent.com/sleeparalysis/ygocards/main/data/cardinfo.json');
    database.search(keyword);
}

const newdeck = () => {
    deck = new Deck();
    deck.new('main');
    deck.new('extra')
}

const deletedeck = () => {
    deck.delete('main');
    deck.delete('extra')
    deck = null;
}

const add = (id) => {
    if(deck == null) {
        newdeck();
    }
    deck.push(collection.card(id));
    deck.sort();
    deck.display('main');
    deck.display('extra');
}

const remove = (id) => {
    deck.pop(collection.card(id));
    deck.sort();
    deck.display('main');
    deck.display('extra');
}

const getInfo = (id) => {
    const imgelement = document.getElementById('image');
    var imgHTMLString = `
        <img
            id="${collection.card(id).id}"
            class="card"
            src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards/${collection.card(id).id}.jpg"
            loading="eager"/>
    `;
    imgelement.innerHTML = imgHTMLString;

    descHTML = `<p>${collection.card(id).desc}</p>`;
    lineHTML =  `<hr class="solid">`;

    if(collection.card(id).level != null) {
        levelHTML= `<h3>${collection.card(id).stars}</h3>`;
    }
    else {
        levelHTML = ``;
    }

    if(collection.card(id).atk != null) {
        atkHTML = `<span class="bold">ATK/${collection.card(id).atk}</span>`;
    }
    else {
        atkHTML = ``;
    }

    if(collection.card(id).def != null) {
        defHTML = `<span class="bold">DEF/${collection.card(id).def}</span>`;
    }
    else {
        defHTML = ``;
    }

    if(collection.card(id).linkval != null) {
        linkHTML = `<span class="bold">LINK-${collection.card(id).linkval}</span>`;
    }
    else {
        linkHTML = ``;
    }

    statsHTML = `
        <div class="stats">
            ${atkHTML}
            ${defHTML}
            ${linkHTML}
        </div>
    `;

    const infoelement = document.getElementById('info');
    var infoHTMLString = `<div class="info">` + descHTML + `</div>`;
  
    infoelement.innerHTML = infoHTMLString;
}

class Database {
    constructor(url) {
        this.url = url;
        this.results = null;
    }

    search = (keyword) => {
        var keyword = document.getElementById('textbox').value;
        this.results = new Collection();
            
        fetch(this.url)
            .then((res) => res.json())
            .then((data) => {
                for(let i = 0; i < data.data.length; i++) {
                    if(this.contains(keyword, data.data[i])) {
                        const card = new Card(data.data[i]);
                        this.results.push(card);
                    }
                }

                this.results.displayCards('gallery');
            }
        );
    }

    contains = (keyword, data) => {
        if(data.name != null && data.name.toLowerCase().match(keyword.toLowerCase()) ||
            data.type != null && data.type.toLowerCase().match(keyword.toLowerCase()) ||
            data.desc != null && data.desc.toLowerCase().match(keyword.toLowerCase()) ||
            (data.archetype != null && data.archetype.toLowerCase().match(keyword.toLowerCase())) ||
            (data.race != null && data.race.toLowerCase().match(keyword.toLowerCase())) ||
            (data.attribute != null && data.attribute.toLowerCase().match(keyword.toLowerCase())))
        { 
            return true;
        }
    
        return false;
    }

    update = (url, filename) => {
        fetch(url)
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

class Card {
    constructor(data) {
        this.id = data.id,
        this.name = data.name,
        this.type = data.type,
        this.desc = data.desc.replaceAll('●', '<br>●'),
        this.atk = data.atk,
        this.def = data.def,
        this.level = data.level,
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
    constructor(size) {
        this.cards = [];
        this.size = size;
        this.max = 3;
    }

    push = (card) => {
        this.cards.push(card);
    }

    pop = (card) => {
        for(let i = 0; i < this.cards.length; i++) {
            if(card.name == this.cards[i].name) {
                this.cards.splice(i, 1);
                break;
            }
        }
    }

    copy = (card) => {
        var copy = 0;
        for(let i = 0; i < this.cards.length; i++) {
            if(card.id == this.cards[i].id) {
                copy++;
            }
        }
        
        return copy;
    }
    
    clear = () => {
        this.cards = [];
    }

    sort = () => {
        for(let j = 0; j < this.cards.length; j++) {
            for(let i = 0; i < this.main.length - 1; i++) {           
                if(this.cards[i].name > this.cards[i + 1].name) {
                    var temp = this.cards[i];
                    this.cards[i] = this.cards[i + 1];
                    this.cards[i + 1] = temp;
                }
            }
        }
    }

    displayCards = (elementID) => {
        const info = document.getElementById(elementID);
        var HTMLString = this.cards.map(card => `
            <li id=sleeve>
                <img
                id="${card.id}"
                class="card"
                src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards/${card.id}.jpg"
                loading="lazy"/>
            </li>`).join('');
        info.innerHTML = HTMLString;
    }
}

