async function loadCatalog() {

const response = await fetch("products.json")
const products = await response.json()

renderCatalog(products)

}

function renderCatalog(products){

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

products.forEach(product => {

const title =
product.name_en ||
product.name_ru ||
product.name ||
"Без названия"

const type =
product.type ||
""

const price =
product.price ||
0

const card = document.createElement("div")
card.className = "card"

card.innerHTML = `

<div class="type">
${type}
</div>

<div class="title">
${title}
</div>

<div class="price">
${price} ₽
</div>

<a href="product.html?id=${product.id}" class="btn">
Подробнее
</a>

`

grid.appendChild(card)

})

}

loadCatalog()