class Gallery {
    min_row = 1;
    max_row = 8;
    total_rows = 0;
    current_row = 1;

    add = () => {
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

    sub = () => {
        if(current_row > min_row) { current_row--; }
        document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
    }
    
    resize = () => {
        while(total_rows < current_row) { current_row--; }
        document.getElementById('gallery').style.height = `calc((85px * ${current_row} - 5px)`;
    }
    
    openresults = () => {
        document.getElementById('resize').style.display = 'flex';
        document.getElementById('gallery').style.display = 'flex';
        resize();
    }
    
    closeresults = () => {
        document.getElementById('resize').style.display = 'none';
        document.getElementById('gallery').style.display = 'none';
    }
    
    getTotalRows = (items) => {
        total_rows = Math.ceil(items / 8);
    }
}

class Card {
    constructor(data) {
        this.id = data.id,
        this.name = data.name,
        this.type = data.type,
        this.desc = data.desc,
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
        this.prices = data.data[i].card_prices
    }
    
    get id() { return this.id; }
    get name() { return this.name; }
    get type() { return this.type; }
    get desc() { return this.desc; }
    get atk() { return this.atk; }
    get def() { return this.def; }
    get level() { return this.level; }
    get race() { return this.race; }
    get attribute() { return this.attribute; }
    get archetype() { return this.archetype; }
    get linkval() { return this.linkval; }
    get sets() { return this.sets; }
    get image() { return this.image; }
    get thumbnail() { return this.thumbnail; }
    get prices() { return this.prices; }

}

class Collection {
    constructor() { this.collection = []; }
    constructor(collection) { this.collection = collection; }

    get collection() { return this.collection; }

    push = (card) => {
        this.collection.push(card);
    }

    card = (id) => {
        for(let i = 0; i < this.collection.length; i++) {
            if(id == this.collection[i].id) {
                return this.collection[i];
            }
        }
    }
}

class Search {
    constructor(keyword) {
        this.keyword = keyword;
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

    search = () => {
        var keyword = document.getElementById('textbox').value;
        fetch('https://raw.githubusercontent.com/sleeparalysis/ygocards/main/data/cardinfo.json')
            .then((res) => res.json())
            .then((data) => {
                const collection = new Collection;
                for(let i = 0; i < data.data.length; i++) {
                    if(containsKeyword(keyword, data.data[i])) {
                        cards.push(data.data[i].id)
                    }
                }
                getTotalRows(cards.length);
                displayCards(cards);
                openresults();
            }
        );
    }
}