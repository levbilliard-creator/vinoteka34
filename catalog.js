let products = []
let currentCategory = "all"

async function loadCatalog(){

const response = await fetch("/data/products.json")

products = await response.json()

buildCategories()

renderCatalog(products)

}

function buildCategories(){

const types = new Set()

products.forEach(p => {

if(p.type) types.add(p.type)

})

const list = document.getElementById("category-list")

list.innerHTML = `<div class="category active" data-type="all">Все</div>`

types.forEach(type => {

list.innerHTML += `
<div class="category" data-type="${type}">
${type}
</div>
`

})

document.querySelectorAll(".category").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".category").forEach(c=>c.classList.remove("active"))

btn.classList.add("active")

currentCategory = btn.dataset.type

filterCatalog()

})

})

}

function filterCatalog(){

let filtered = products

if(currentCategory !== "all"){

filtered = products.filter(p => p.type === currentCategory)

}

renderCatalog(filtered)

}

function renderCatalog(data){

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

data.forEach(product=>{

const nameRu = product.name_ru || ""
const nameEn = product.name_en || ""

const color = product.color || ""
const style = product.style || ""

const price = product.price || ""

const card = document.createElement("div")

card.className = "wine-card"

card.innerHTML = `

<div class="wine-type">${product.type}</div>

<div class="wine-name-en">${nameEn}</div>

<div class="wine-name-ru">${nameRu}</div>

<div class="wine-style">${color} ${style}</div>

<div class="wine-price">${price} ₽</div>

<a href="#" class="wine-btn">Подробнее</a>

`

grid.appendChild(card)

})

}

document.querySelector(".search").addEventListener("input", e=>{

const value = e.target.value.toLowerCase()

const filtered = products.filter(p => {

const text = (p.name_ru || "") + (p.name_en || "")

return text.toLowerCase().includes(value)

})

renderCatalog(filtered)

})

loadCatalog()