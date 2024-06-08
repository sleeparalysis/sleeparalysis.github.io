const view = (id) => {
    var body = document.body;
    var img = document.getElementById(id);
    var modal = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");
    var span = document.getElementsByClassName("close")[0];
    
    var card = database.getItem(id);
    var name = document.getElementById("card-name");
    var desc = document.getElementById("card-description");
    
    if(modal.style.display === "none" || modal.style.display === "") {
        // Disable scrolling when modal is displayed
        body.style.overflow = "hidden";

        // Display modal
        modal.style.display = "flex";

        // Inject card image src
        modalContent.src = img.src;
        modalContent.style.width = "500px";

        // Inject card name
        name.innerText = card.name;

        // Inject card description
        desc.innerText = card.getFormattedDesc();
    }
    else {
        // Initialize style display
        modal.style.display = "none";
    }
    
    span.onclick = function() {
        // Enable scrolling when modal is hidden
        body.style.overflow = "auto";

        // Hide modal
        modal.style.display = "none";
    }
}

const close = () => {
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("modal");

    span.onclick = function() {
        modal.style.display = "none";
    }
}

const parseFile = (file) => {
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null);
    var data = JSON.parse(request.responseText);
    return data;
}

const getDropdown = () => {
    card1 = document.getElementById("card1");
    card2 = document.getElementById("card2");
    type1 = document.getElementById("type1");
    type2 = document.getElementById("type2");
    format = document.getElementById("format");
    limit = document.getElementById("limit");

    switch (card1.value) {
        // Filter by monster cards
        case 'monster':
            // Enable card2 filters
            card2.disabled = false;

            // Set card2 default value
            card2.value = '';

            // Set type1 filter default value
            type1.value = '';

            // Enable type2 filters
            type2.disabled = false;

            // Enable all type1 filters
            for(let i = 0; i < type1.options.length; i++) {
                type1.options[i].style.display = "block";
            }

            // Disable last 7 type1 filters
            for(let i = 26; i < type1.options.length; i++) {
                type1.options[i].style.display = "none";
            }

            break;
        // Filter by spell cards
        case 'spell':
            // Disable card2 filters
            card2.disabled = true;

            // Set card2 default value
            card2.value = '';

            // Set type1 filter default value
            type1.value = '';

            // Disable type2 filters
            type2.disabled = true;

            // Enable all type1 filters
            for(let i = 0; i < type1.options.length; i++) {
                type1.options[i].style.display = "block";
            }

            // Disable first 25 options
            for(let i = 1; i < type1.options.length - 7; i++) {
                type1.options[i].style.display = "none";
            }

            // Disable counter option
            type1.options[31].style.display = "none";

            break;
        case 'trap':
            // Disable card2 filters
            card2.disabled = true;

            // Set card2 default value
            card2.value = '';

            // Set type1 filter default value
            type1.value = '';

            // Disable type2 filters
            type2.disabled = true;

            // Enable all type1 filters
            for(let i = 0; i < type1.options.length; i++) {
                type1.options[i].style.display = "block";
            }

            // Disable first 25 options
            for(let i = 1; i < type1.options.length - 7; i++) {
                type1.options[i].style.display = "none";
            }

            // Disable field option
            type1.options[27].style.display = "none";

            // Disable equip option
            type1.options[28].style.display = "none";

            // Disable quick-play option
            type1.options[30].style.display = "none";

            // Disablle ritual option
            type1.options[31].style.display = "none";

            break;    
        default:
            // Disable card2 filters by default
            card2.disabled = true;

            // Set card2 filters default value
            card2.value = '';

            // Enable all type1 filters
            for(let i = 0; i < type1.options.length; i++) {
                type1.options[i].style.display = "block";
            }
           
            // Disable type2 filter by default
            type2.disabled = true;

            // Set type2 filter default value
            type2.value = '';

            break;
    }

    switch (format.value) {
        case 'tcg':
        case 'ocg':
        case 'goat':
            limit.disabled = false;
            break;
        default:
            limit.disabled = true;
            limit.value = '';
            break;

    }
}

const updateDropdown = (id) => {
    switch (id) {
        case 'card1':
            break;
        case 'card1':
            break;
        case 'card1':
            break;
        case 'card1':
            break;
    }
}



const search = () => {
    // List of active filters
    var filters = [];

    // List of filters to be set as active secondary filtering
    var tempfilters = [];

    // Retrieve filter list from file
    var filterData = parseFile('./data/sort.json');

    // Add name filtering to the active filters list
    if (document.getElementById("name").value != '') {
        filters.push(['name', document.getElementById("name").value]);
    }

    // Add temporary filters based on card type
    if (document.getElementById("card1").value != '') {
        for (let i = 0; i < filterData.types.length; i++) {
            if (filterData.types[i].toLowerCase().includes(document.getElementById("card1").value)) {
                tempfilters.push(['card1', filterData.types[i]]);
                
            }
        }
    }

    // Remove temporary filters and keep only desired monster type 
    if (document.getElementById("card2").value != '') {
        for (let i = 0; i < tempfilters.length; i++) {
            if (!tempfilters[i][1].toLowerCase().includes(document.getElementById("card2").value)) {

                // Remove one item at index i
                tempfilters.splice(i, 1);
                
                // Step back one index since splice makes the array smaller by 1 
                i--;
            }
        }
    }

    // Filter by type
    if (document.getElementById("type1").value != '') {
        filters.push(['type1', document.getElementById("type1").value]);
    }

    // Filter by ability
    if (document.getElementById("type2").value != '') {
        filters.push(['type2', document.getElementById("type2").value]);
    }

    // Filter by archetype
    if (document.getElementById("archetype").value != '') {
        filters.push(['archetype', document.getElementById("archetype").value]);
    }

    // Filter by format
    if (document.getElementById("format").value != '') {
        filters.push(['format', document.getElementById("format").value]);
    }

    // Filter by card limit
    if (document.getElementById("limit").value != '') {
        filters.push([`banlist`, document.getElementById("limit").value]);
    }

    /*
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
    */
    


    filters = filters.concat(tempfilters);
    database.searchList(filters);
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

    getFormattedDesc = () => {
        // Adjust text for pendulum cards
        var formattedDesc = this.desc.replaceAll(".\n[", ".\n\n[");
        
        return formattedDesc;
    }

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
}

class Database {
    constructor() {
        this.list = [];
    }

    addItem = (card) => {
        this.list.push(card);
    }

    getItem = (id) => {
        for (let i = 0; i < this.list.length; i++) {
            if (id == this.list[i].getID()) {
                return this.list[i];
            }
        }
    }

    sortList = (type) => {
        for (let j = 0; j < this.list.length; j++) {
            for (let i = 0; i < this.list.length - 1; i++) {
                if (this.list[i].getName() > this.list[i + 1].getName()) {
                    var temp = this.list[i];
                    this.list[i] = this.list[i + 1];
                    this.list[i + 1] = temp;
                }
            }
        }
    }

    clearList = () => {
        while (this.list.length > 0) {
            this.list.pop();
        }
    }

    filteredUrl = (filters) => {
        var url = '';
        
        for (let i = 0; i < filters.length; i++) {
            if (filters[i][0] == 'name') {
                url += `&fname=${filters[i][1]}`;
            }
            if (filters[i][0] == 'card1') {
                if (filters[i][0] == 'card1') {
                    if (!url.includes('&type=')) {
                        url += `&type=${filters[i][1]}`;
                    }
                    else {
                        url += `,${filters[i][1]}`
                    }
                }
            }
            if (filters[i][0] == 'type1') {
                url += `&race=${filters[i][1]}`
            }
            if (filters[i][0] == 'archetype') {
                url += `&archetype=${filters[i][1]}`
            }
            if (filters[i][0] == 'format') {
                url += `&format=${filters[i][1]}`
            }
        }

        console.log(url);
        return url;
    }

    searchList = (filters) => {
        this.clearList();

        fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes' + this.filteredUrl(filters))
            .then((res) => res.json())
            .then((data) => {
                try {
                    for (let i = 0; i < data.data.length; i++) {
                        const card = new Card(data.data[i]);

                        if (document.getElementById("limit").value == "") {
                            this.addItem(card);
                        }
                        else if (card.getBanlistInfo() == null) {
                            if (document.getElementById("format").value != "edison" && document.getElementById("limit").value == "unlimited") {
                                this.addItem(card);
                            }
                            else if (document.getElementById("format").value == "edison") {
                                // No edison banlist support
                            }
                        }
                        else if (card.getBanlistInfo() != null) {
                            if (document.getElementById("format") == "tcg" && card.getBanlistInfo().ban_tcg != null) {
                                if (document.getElementById("limit").value == card.getBanlistInfo().ban_tcg.toLowerCase()) {
                                    this.addItem(card);
                                }
                            }
                            else if (document.getElementById("format") == "ocg" && card.getBanlistInfo().ban_ocg != null) {
                                if (document.getElementById("limit").value == card.getBanlistInfo().ban_ocg.toLowerCase()) {
                                    this.addItem(card);
                                }
                            }

                            else if (document.getElementById("format") == "goat" && card.getBanlistInfo().ban_goat != null) {
                                if (document.getElementById("limit").value == card.getBanlistInfo().ban_goat.toLowerCase()) {
                                    this.addItem(card);
                                }
                            }
                        }
                    }
                }
                catch (error) {
                    window.confirm('No results found');
                }

                this.displayList('gallery');
            }
            );
    }

    displayList = (elementID) => {
        const info = document.getElementById(elementID);
        var HTMLString = `<div class="${elementID}">`;

        for (let i = 0; i < this.list.length; i++) {
            HTMLString += this.list[i].getCardHTML();
        }

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
getDropdown();
search();