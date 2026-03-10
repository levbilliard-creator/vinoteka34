let products = []

function getId(){

const params =
new URLSearchParams(window.location.search)

return parseInt(params.get("id"))

}

function cleanWineName(name){

if(!name) return ""

let cleaned = name

cleaned = cleaned
.replace(/вино/gi,"")
.replace(/столовое/gi,"")
.replace(/сортовое/gi,"")
.replace(/марочное/gi,"")
.replace(/натуральное/gi,"")
.replace(/ординарное/gi,"")

.replace(/сухое/gi,"")
.replace(/полусухое/gi,"")
.replace(/полусладкое/gi,"")
.replace(/сладкое/gi,"")

.replace(/белое/gi,"")
.replace(/красное/gi,"")
.replace(/розовое/gi,"")
.replace(/игристое/gi,"")

cleaned = cleaned.replace(/\s+/g," ").trim()

return cleaned

}

async function loadProduct(){

const response =
await fetch("data/products.json")

products =
await response.json()

const id =
getId()

const product =
products.find(p => p.id === id)

renderProduct(product)

renderSimilar(product)

}

function renderProduct(product){

document.getElementById("title")
.innerText =
cleanWineName(product.name)

document.getElementById("type")
.innerText =
product.type

document.getElementById("price")
.innerText =
product.price + " ₽"

const telegram =
document.getElementById("telegramBtn")

telegram.href =
"https://t.me/vinotekakaram"

}

function renderSimilar(product){

const container =
document.getElementById("similar")

const similar =
products
.filter(p =>
p.category === product.category &&
p.id !== product.id
)
.slice(0,4)

similar.forEach(wine => {

const card =
document.createElement("div")

card.className =
"product-card"

card.innerHTML = `

<div class="product-type">
${wine.type}
</div>

<div class="product-name">
${cleanWineName(wine.name)}
</div>

<div class="product-price">
${wine.price} ₽
</div>

<a href="product.html?id=${wine.id}" class="product-btn">
Открыть
</a>

`

container.appendChild(card)

})

}

loadProduct()