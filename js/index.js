const getInput = () => {
    var search = document.getElementById('searchbox').value;
    fetchCard(search);
}

const getImage = (id) => {
    document.getElementById('card').src = `https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards/${id}.jpg`;

    fetch('../js/cardinfo.json')
        .then((res) => res.json())
        .then((data) => {
            for(let i = 0; i < data.data.length; i++) {
                if(String(data.data[i].id).match(String(id))) {
                    const info = document.getElementById('column2');
                    var HTMLString = `
                        <div id="info">
                            <h2>${data.data[i].name}</h2>
                            <p><span class="bold">Description</span></p>
                            <p>${data.data[i].desc}</p>
                            <p><span class="bold">Type:</span> ${data.data[i].type}</p>
                            <p><span class="bold">Race:</span> ${data.data[i].race}</p>
                            <p><span class="bold">Attribute:</span> ${data.data[i].attribute}</p>
                            <p><span class="bold">Archtype:</span> ${data.data[i].archetype}</p>
                            
                        </div>
                        `;
                    info.innerHTML = HTMLString;
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
             <img id="${selected.id}" class="card_small" src="https://raw.githubusercontent.com/sleeparalysis/ygocards/main/img/cards_small/${selected.id}.jpg" loading="lazy" onclick="getImage(this.id)"/>
        `
    ).join('');
    
    info.innerHTML = HTMLString;
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