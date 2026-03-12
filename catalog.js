async function loadCatalog(){

const response = await fetch("/data/products.json")

const products = await response.json()

renderCatalog(products)

}

function renderCatalog(products){

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

products.forEach(product => {

const nameRu = product.name_ru || product.name || ""
const nameEn = product.name_en || ""

const type = product.type || ""
const color = product.color || ""
const style = product.style || ""

const price = product.price || 0

const card = document.createElement("div")
card.className = "wine-card"

card.innerHTML = `

<div class="wine-type">${type}</div>

<div class="wine-name-en">${nameEn}</div>

<div class="wine-name-ru">${nameRu}</div>

<div class="wine-style">${color} ${style}</div>

<div class="wine-price">${price} ₽</div>

<a href="product.html?id=${product.id}" class="wine-btn">
Подробнее
</a>

`

grid.appendChild(card)

})

}

loadCatalog()