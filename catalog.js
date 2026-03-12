async function loadCatalog(){

try{

const response = await fetch("products.json")

const products = await response.json()

renderCatalog(products)

}catch(e){

console.error("Ошибка загрузки каталога", e)

}

}

function renderCatalog(products){

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

products.forEach(product => {

const name =
product.name ||
product.name_ru ||
product.name_en ||
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
${name}
</div>

<div class="price">
${price} ₽
</div>

<button class="btn">
Подробнее
</button>

`

grid.appendChild(card)

})

}

loadCatalog()