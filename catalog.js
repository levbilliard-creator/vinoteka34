let products = []

async function loadCatalog(){

const response = await fetch("data/products.json")

products = await response.json()

renderCatalog(products)

}

function detectCountry(name){

name = name.toLowerCase()

if(name.includes("rioja")) return "Spain"
if(name.includes("barolo")) return "Italy"
if(name.includes("chianti")) return "Italy"
if(name.includes("amarone")) return "Italy"
if(name.includes("prosecco")) return "Italy"

if(name.includes("bordeaux")) return "France"
if(name.includes("bourgogne")) return "France"
if(name.includes("chablis")) return "France"
if(name.includes("sancerre")) return "France"
if(name.includes("muscadet")) return "France"

if(name.includes("marlborough")) return "New Zealand"
if(name.includes("mendoza")) return "Argentina"

return ""

}

function detectGrape(name){

name = name.toLowerCase()

if(name.includes("pinot")) return "Pinot Noir"
if(name.includes("chardonnay")) return "Chardonnay"
if(name.includes("sauvignon")) return "Sauvignon Blanc"
if(name.includes("merlot")) return "Merlot"
if(name.includes("cabernet")) return "Cabernet Sauvignon"
if(name.includes("riesling")) return "Riesling"
if(name.includes("malbec")) return "Malbec"
if(name.includes("tempranillo")) return "Tempranillo"
if(name.includes("sangiovese")) return "Sangiovese"

return ""

}

function processCatalog(){

const updated = products.map(p => {

const en = p.name_en || ""

const country = detectCountry(en)
const grape = detectGrape(en)

return {

...p,

country: country,
grape: grape

}

})

const blob = new Blob(
[JSON.stringify(updated,null,2)],
{type:"application/json"}
)

const a = document.createElement("a")

a.href = URL.createObjectURL(blob)

a.download = "products_ready.json"

a.click()

}

function renderCatalog(list){

const container =
document.getElementById("catalog-grid")

container.innerHTML = ""

list.forEach(product => {

const card = document.createElement("div")

card.className = "product-card"

card.innerHTML = `

<div class="product-type">
${product.type || ""}
</div>

<div class="product-name-en">
${product.name_en || ""}
</div>

<div class="product-name">
${product.name}
</div>

<div class="product-price">
${product.price} ₽
</div>

<a href="product.html?id=${product.id}" class="product-btn">
Подробнее
</a>

`

container.appendChild(card)

})

}

document
.getElementById("processBtn")
.addEventListener("click",processCatalog)

loadCatalog()