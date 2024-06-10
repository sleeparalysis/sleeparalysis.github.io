// Ygoprodeck API link
const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes';

// Display modal and populate with selected card information
const view = (id) => {
    // Get html references
    const body = document.body;
    var img = document.getElementById(id);
    var modal = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");

    // Display if modal is hidden
    if (modal.style.display === "none" || modal.style.display === "") {
        // Disable scrolling and display modal
        body.style.overflow = "hidden";
        modal.style.display = "flex";

        // Inject card image via clicked element id
        modalContent.src = img.src;
        modalContent.style.width = "500px";
    }
    else {
        // Initialize style display if empty
        modal.style.display = "none";
    }

    // Close modal when modal element is clicked
    modal.onclick = function () {
        // Enable scrolling and hide modal
        body.style.overflow = "auto";
        modal.style.display = "none";
    }
}

// Request response from JSON file and return parsed JSON data
const parseFile = (file) => {
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null);
    var data = JSON.parse(request.responseText);
    return data;
}

// Update dropdown contents based on other dropdown selections
const getDropdown = () => {
    // Input references
    var card1 = document.getElementById("card1");
    var card2 = document.getElementById("card2");
    var type = document.getElementById("type");
    var format = document.getElementById("format");
    var limit = document.getElementById("limit");

    // Update dropdowns based on card type
    switch (card1.value) {
    case 'monster':
        // Set default values
        card2.disabled = false;
        card2.value = '';
        type.value = '';

        // Enable all type filters
        for (let i = 0; i < type.options.length; i++) {
            type.options[i].style.display = "block";
        }

        // Disable last 7 type filters
        for (let i = 26; i < type.options.length; i++) {
            type.options[i].style.display = "none";
        }

        break;
    case 'spell':
        // Set default values
        card2.disabled = true;
        card2.value = '';
        type.value = '';

        // Enable all type filters
        for (let i = 0; i < type.options.length; i++) {
            type.options[i].style.display = "block";
        }

        // Disable first 25 options
        for (let i = 1; i < type.options.length - 7; i++) {
            type.options[i].style.display = "none";
        }

        // Disable counter option
        type.options[32].style.display = "none";

        break;
    case 'trap':
        // Set default values
        card2.disabled = true;
        card2.value = '';
        type.value = '';

        // Enable all type filters
        for (let i = 0; i < type.options.length; i++) {
            type.options[i].style.display = "block";
        }

        // Disable first 25 options
        for (let i = 1; i < type.options.length - 7; i++) {
            type.options[i].style.display = "none";
        }

        // Disable spell options
        type.options[27].style.display = "none";
        type.options[28].style.display = "none";
        type.options[30].style.display = "none";
        type.options[31].style.display = "none";

        break;
    default:
        // Set default values
        card2.disabled = true;
        card2.value = '';
        type.value = '';

        // Enable all type filters
        for (let i = 0; i < type.options.length; i++) {
            type.options[i].style.display = "block";
        }

        break;
    }

    // Update limit dropdown based on format
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

// Search 
const search = () => {
    // Initialize filters
    var filters = [];
    var tempfilters = [];

    // Input references
    var fname = document.getElementById("name");
    var card1 = document.getElementById("card1");
    var card2 = document.getElementById("card2");
    var type = document.getElementById("type");
    var archetype = document.getElementById("archetype");
    var format = document.getElementById("format");
    var limit = document.getElementById("limit");

    // Add cards that partially matches the inputted text
    if (fname.value != '') {
        filters.push(['name', fname.value]);
    }

    // Filter by type
    if (type.value != '') {
        filters.push(['type', type.value]);
    }

    // Filter by archetype
    if (archetype.value != '') {
        filters.push(['archetype', archetype.value]);
    }

    // Filter by format
    if (format.value != '') {
        filters.push(['format', format.value]);
    }

    // Filter by card limit
    if (limit.value != '') {
        filters.push([`banlist`, limit.value]);
    }

    // Add types that matches the selected card type
    if (card1.value != '') {
        for (let i = 0; i < filterData.types.length; i++) {
            if (filterData.types[i].toLowerCase().includes(card1.value)) {
                tempfilters.push(['card1', filterData.types[i]]);
            }
        }
    }

    // Remove temporary types that do not match the selected monster type
    if (card2.value != '') {
        for (let i = 0; i < tempfilters.length; i++) {
            if (!tempfilters[i][1].toLowerCase().includes(card2.value)) {
                tempfilters.splice(i, 1);
                i--;
            }
        }
    }

    // Create filtered url to send to API
    filters = filters.concat(tempfilters);
    filteredURL = createFilteredUrl(filters);

    // Populate database with filtered results from API
    database.init(filteredURL);
}

// Create a URL to use for filtering in the API
createFilteredUrl = (filters) => {
    // Set base url
    var filteredURL = url;

    // Add API compliant strings using the filter objects passed
    for (let i = 0; i < filters.length; i++) {
        switch(filters[i][0]) {
        case 'name': 
            filteredURL += `&fname=${filters[i][1]}`;
            break;
        case 'type':
            filteredURL += `&race=${filters[i][1]}`;
            break;
        case 'archetype':
            filteredURL += `&archetype=${filters[i][1]}`;
            break;
        case 'format':
            filteredURL += `&format=${filters[i][1]}`;
            break;
        case 'card1':
            // Add "&type=" only once and build type list using commas
            if (!filteredURL.includes('&type=')) {
                filteredURL += `&type=${filters[i][1]}`;
            }
            else {
                filteredURL += `,${filters[i][1]}`
            }
            break;
        }
    }

    return filteredURL;
}

// Database class that will pull and save card data from API
class Database {
    constructor() {
        this.results = [];
    }

    // Initialize list with new results on search
    init = (filteredURL) => {
        this.clear();

        // Fetch card data from API
        fetch(filteredURL)
            .then((res) => res.json())
            .then((data) => {
                try {
                    for (let i = 0; i < data.data.length; i++) {
                        this.add(new Card(data.data[i]));
                    }
                }
                catch (error) {
                    window.confirm('Invalid API address');
                }

                this.display('gallery');
            }
        );
    }

    // Add onl
    add = (card) => {  
        var format = document.getElementById("format");
        var limit = document.getElementById("limit");

        if (limit.value == "") {
            this.results.push(card);
        }
        else if (card.getBanlistInfo() == null) {
            if (format.value != "edison" && limit.value == "unlimited") {
                this.results.push(card);
            }
            else if (format.value == "edison") {
                // No edison banlist support
            }
        }
        else if (card.getBanlistInfo() != null) {
            if (format.value == "tcg" && card.getBanlistInfo().ban_tcg != null) {
                if (limit.value == card.getBanlistInfo().ban_tcg.toLowerCase()) {
                    this.results.push(card);
                }
            }
            else if (format.value == "ocg" && card.getBanlistInfo().ban_ocg != null) {
                if (limit.value == card.getBanlistInfo().ban_ocg.toLowerCase()) {
                    this.results.push(card);
                }
            }

            else if (format.value == "goat" && card.getBanlistInfo().ban_goat != null) {
                if (limit.value == card.getBanlistInfo().ban_goat.toLowerCase()) {
                    this.results.push(card);
                }
            }
        }
    }

    display = (elementID) => {
        const info = document.getElementById(elementID);
        var HTMLString = `<div class="${elementID}">`;

        for (let i = 0; i < this.results.length; i++) {
            HTMLString += this.results[i].getCardHTML();
        }

        HTMLString += '</div>';
        info.innerHTML = HTMLString;
    }

    // Search through list for card matching the passed ID and return it
    get = (id) => {
        for (let i = 0; i < this.results.length; i++) {
            if (id == this.results[i].getID()) {
                return this.results[i];
            }
        }
    }

    // Sort list alphabetically based on name
    sort = (type) => {
        for (let j = 0; j < this.results.length; j++) {
            for (let i = 0; i < this.results.length - 1; i++) {
                if (this.results[i].getName() > this.results[i + 1].getName()) {
                    var temp = this.results[i];
                    this.results[i] = this.results[i + 1];
                    this.results[i + 1] = temp;
                }
            }
        }
    }

    save = (filename) => {
        fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes')
            .then((res) => res.blob())
            .then((data) => {
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(data);
                a.download = filename;
                a.click();
            }
        );
    }

    // Pop all items in list until empty
    clear = () => {
        while (this.results.length > 0) {
            this.results.pop();
        }
    }
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

// Retrieve filter list from file
var filterData = parseFile('./data/sort.json');

var database = new Database();
getDropdown();
search();


