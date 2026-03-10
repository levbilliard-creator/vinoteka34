let products = [];

async function loadCatalog() {

    const response = await fetch("data/products.json");
    products = await response.json();

    renderCatalog(products);
}

function cleanWineName(name) {

    if (!name) return "";

    return name
        .replace(/\b(вино|столовое|сортовое|марочное|натуральное|ординарное)\b/gi, "")
        .replace(/\b(сухое|полусухое|полусладкое|сладкое)\b/gi, "")
        .replace(/\b(красное|белое|розовое|игристое)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

function renderCatalog(list) {

    const container = document.getElementById("catalog");
    container.innerHTML = "";

    list.forEach(product => {

        const id = product.id;
        const rawName = product.name || "";
        const name = cleanWineName(rawName);

        const type = product.type || "";
        const price = product.price || "";
        const image = product.image || "";

        const card = document.createElement("div");
        card.className = "wine-card";

        card.innerHTML = `
        <a href="product.html?id=${id}" class="card-link">

            <div class="wine-img-wrap">
                <img src="${image}" alt="${name}">
            </div>

            <div class="wine-name">
                ${name}
            </div>

            <div class="wine-type">
                ${type}
            </div>

            <div class="wine-price">
                ${price} ₽
            </div>

        </a>
        `;

        container.appendChild(card);
    });
}

loadCatalog();