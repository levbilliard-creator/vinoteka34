async function loadCatalog(){

const response = await fetch("/data/products.json")
const products = await response.json()

window.catalogProducts = products

renderCatalog(products)

initFilters(products)

}

function renderCatalog(products){

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

products.forEach(product => {

const nameRu = product.name_ru || ""
const nameEn = product.name_en || ""
const type = product.type || ""
const color = product.color || ""
const style = product.style || ""
const price = product.price || 0

const image = product.image || "/images/bottle.png"

const card = document.createElement("div")

card.className = "wine-card"

card.innerHTML = `

<div class="wine-image">
<img src="${image}" alt="">
</div>

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

function initFilters(products){

const search = document.querySelector(".search")

search.addEventListener("input", e => {

const value = e.target.value.toLowerCase()

const filtered = products.filter(p => {

const name =
(p.name_ru || "") +
(p.name_en || "")

return name.toLowerCase().includes(value)

})

renderCatalog(filtered)

})

}

loadCatalog()