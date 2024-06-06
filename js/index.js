const checkBan = () => {
    format = document.getElementById("format").value;

    switch (format) {
        case 'tcg':
        case 'ocg':
        case 'edison':
        case 'goat':
            document.getElementById("limit").disabled = false;
            break;
        default:
            document.getElementById("limit").disabled = true;
            document.getElementById('limit').value = '';
            break;

    }
}

const search = () => {
    filters = [];

    if (document.getElementById("name").value != '') {
        filters.push(['name', document.getElementById("name").value]);
    }

    if (document.getElementById("type").value != '') {
        filters.push(['type', document.getElementById("type").value]);
    }

    if (document.getElementById("race").value != '') {
        filters.push(['race', document.getElementById("race").value]);
    }

    if (document.getElementById("archetype").value != '') {
        filters.push(['archetype', document.getElementById("archetype").value]);
    }

    if (document.getElementById("format").value != '') {
        filters.push(['format', document.getElementById("format").value]);
    }

    if (document.getElementById("limit").value != '') {
        filters.push([`banlist`, document.getElementById("limit").value]);
    }

    database.search(filters);
}

const view = (id) => {
    var card = database.get(id);
    window.confirm(card.name + "\n\n" + card.desc);
}

class Card {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.frameType = data.frameType;
        this.desc = data.desc;
        this.pend_desc = data.pend_desc;
        this.monster_desc = data.monster_desc;
        this.atk = data.atk;
        this.def = data.def;
        this.level = data.level;
        this.race = data.race;
        this.attribute = data.attribute;
        this.archetype = data.archetype;
        this.linkval = data.linkval;
        this.linkmarkers = data.linkmarkers;
        this.scale = data.scale;
        this.ygoprodeck_url = data.ygoprodeck_url;
        this.card_sets = data.card_sets;
        this.banlist_info = data.banlist_info;
        this.card_images = data.card_images;
        this.card_prices = data.card_prices;
        this.beta_name = data.misc_info[0].beta_name;
        this.staple = data.misc_info[0].staple;
        this.views = data.misc_info[0].views;
        this.viewsweek = data.misc_info[0].viewsweek;
        this.upvotes = data.misc_info[0].upvotes;
        this.downvotes = data.misc_info[0].downvotes;
        this.formats = data.misc_info[0].formats;
        this.treated_as = data.misc_info[0].treated_as;
        this.beta_id = data.misc_info[0].beta_id;
        this.tcg_date = data.misc_info[0].tcg_date;
        this.ocg_date = data.misc_info[0].ocg_date;
        this.konami_id = data.misc_info[0].konami_id;
        this.has_effect = data.misc_info[0].has_effect;
        this.question_atk = data.misc_info[0].question_atk;
        this.question_def = data.misc_info[0].question_def;
        this.local_images = [{ "local": `../img/${this.id}.jpg`, "local_small": `../img/small/${this.id}.jpg` }];
        this.github_images = [{ "github": `https://raw.githubusercontent.com/sleeparalysis/Yugioh-Cards/main/${this.id}.jpg` }];
        this.ban_edison = "";
    }

    getID = () => { return this.id; }
    getName = () => { return this.name; }
    getType = () => { return this.type; }
    getFrameType = () => { return this.frameType; }
    getDesc = () => { return this.desc; }
    getPendDesc = () => { return this.pend_desc; }
    getMonsterDesc = () => { return this.monster_desc; }
    getAttack = () => { return this.atk; }
    getDefense = () => { return this.def; }
    getLevel = () => { return this.level; }
    getRace = () => { return this.race; }
    getAttribute = () => { return this.attribute; }
    getArchetype = () => { return this.archetype; }
    getLinkVal = () => { return this.linkval; }
    getLinkMarkers = () => { return this.linkmarkers; }
    getScale = () => { return this.scale; }
    getCardURL = () => { return this.ygoprodeck_url; }
    getCardSets = () => { return this.card_sets; }
    getBanlistInfo = () => { return this.banlist_info; }
    getCardImages = () => { return this.card_images; }
    getLocalImages = () => { return this.local_images; }
    getGithubImages = () => { return this.github_images; }
    getCardPrices = () => { return this.card_prices; }
    getBetaName = () => { return this.beta_name; }
    getStaple = () => { return this.staple; }
    getViews = () => { return this.views; }
    getViewsWeek = () => { return this.viewsweek; }
    getUpvotes = () => { return this.upvotes; }
    getDownvotes = () => { return this.downvotes; }
    getFormats = () => { return this.formats; }
    getTreatedAs = () => { return this.treated_as; }
    getBetaID = () => { return this.beta_id; }
    getTCGDate = () => { return this.tcg_date; }
    getOCGDate = () => { return this.ocg_date; }
    getKonamiID = () => { return this.konami_id; }
    getHasEffect = () => { return this.has_effect; }
    getQuestionAtk = () => { return this.question_atk; }
    getQuestionDef = () => { return this.question_def; }

    // Card html code
    getCardHTML = () => {
        return this.cardHTML =
            `<img id="${this.getID()}" 
                class="item"
                src="${this.getCardImages()[0].image_url}" 
                loading='lazy' 
                onclick="view(${this.getID()});"
            />`;
    }

    setEdisonBanlistInfo = (limit) => { this.ban_edison = limit; }
}

class Database {
    constructor() {
        this.cards = [];
        this.url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes';
    }

    add = (card) => {
        this.cards.push(card);
    }

    get = (id) => {
        for (let i = 0; i < this.cards.length; i++) {
            if (id == this.cards[i].getID()) {
                return this.cards[i];
            }
        }
    }

    sort = (type) => {
        for (let j = 0; j < this.cards.length; j++) {
            for (let i = 0; i < this.cards.length - 1; i++) {
                if (this.cards[i].getName() > this.cards[i + 1].getName()) {
                    var temp = this.cards[i];
                    this.cards[i] = this.cards[i + 1];
                    this.cards[i + 1] = temp;
                }
            }
        }
    }

    clear = (array) => {
        while (array.length > 0) {
            array.pop();
        }
    }

    filter = (keywords) => {
        var url = '';

        for (let i = 0; i < keywords.length; i++) {
            if (keywords[i][0] == 'name') {
                url += `&fname=${keywords[i][1]}`
            }
            else if (keywords[i][0] == 'type') {
                url += `&type=${keywords[i][1]}`
            }
            else if (keywords[i][0] == 'race') {
                url += `&race=${keywords[i][1]}`
            }
            else if (keywords[i][0] == 'archetype') {
                url += `&archetype=${keywords[i][1]}`
            }
            else if (keywords[i][0] == 'format') {
                url += `&format=${keywords[i][1]}`
            }
        }

        return url;
    }

    search = (keywords) => {
        this.clear(this.cards);

        fetch(this.url + this.filter(keywords))
            .then((res) => res.json())
            .then((data) => {
                try {
                    for (let i = 0; i < data.data.length; i++) {
                        const card = new Card(data.data[i]);

                        if (document.getElementById("limit").value == "") {
                            this.add(card);
                        }
                        else if (card.getBanlistInfo() == null) {
                            if (document.getElementById("format").value != "edison" && document.getElementById("limit").value == "unlimited") {
                                this.add(card);
                            }
                            else if (document.getElementById("format").value == "edison") {

                            }
                        }
                        else if (card.getBanlistInfo() != null) {
                            if (document.getElementById("format") == "tcg" && card.getBanlistInfo().ban_tcg != null) {
                                if (document.getElementById("limit").value == card.getBanlistInfo().ban_tcg.toLowerCase()) {
                                    this.add(card);
                                }
                            }
                            else if (document.getElementById("format") == "ocg" && card.getBanlistInfo().ban_ocg != null) {
                                if (document.getElementById("limit").value == card.getBanlistInfo().ban_ocg.toLowerCase()) {
                                    this.add(card);
                                }
                            }

                            else if (document.getElementById("format") == "goat" && card.getBanlistInfo().ban_goat != null) {
                                if (document.getElementById("limit").value == card.getBanlistInfo().ban_goat.toLowerCase()) {
                                    this.add(card);
                                }
                            }
                        }
                    }
                }
                catch (error) {
                    window.confirm('No results found');
                }

                this.display('gallery');
            }
            );
    }

    display = (elementID) => {
        const info = document.getElementById(elementID);
        var HTMLString = `<div class="${elementID}">`;

        for (let i = 0; i < this.cards.length; i++) {
            HTMLString += this.cards[i].getCardHTML();
        }

        HTMLString += '</div>';
        info.innerHTML = HTMLString;
    }

    /*
    search = (keyword, elementID) => {
        const info = document.getElementById(elementID);
        var HTMLString = `<div class="${elementID}">`;
        
        for(let i = 0; i < this.cards.length; i++) {
            if(this.cards[i].getName().toLowerCase().match(keyword.toLowerCase())) {
                HTMLString += this.cards[i].getCardHTML();
            }
        }

        HTMLString += '</div>';
        info.innerHTML = HTMLString;
    }
    */

    random = (elementID) => {
        const info = document.getElementById(elementID);
        var HTMLString = '<div class="container">';

        var i = Math.floor(Math.random() * this.cards.length);
        HTMLString += this.cards[i].getCardHTML();

        HTMLString += '</div>';
        info.innerHTML = HTMLString;
    }

    update = (filename) => {
        fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
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

var database = new Database();
search();