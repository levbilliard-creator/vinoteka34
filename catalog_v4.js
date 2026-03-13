let products = []
let filteredProducts = []
let currentCategory = "all"

async function initCatalog(){

const response = await fetch("/data/products.json")

products = await response.json()

filteredProducts = products

buildCategories()

renderCatalog(filteredProducts)

initSearch()

}

function buildCategories(){

const categories = new Set()

products.forEach(p => {

if(p.category){
categories.add(p.category)
}

})

const list = document.getElementById("category-list")

if(!list) return

list.innerHTML = ""

const all = document.createElement("div")

all.className = "category active"

all.innerText = "Все"

all.onclick = () => {

currentCategory = "all"

updateCategoryUI(all)

renderCatalog(products)

}

list.appendChild(all)

categories.forEach(cat => {

const el = document.createElement("div")

el.className = "category"

el.innerText = cat

el.onclick = () => {

currentCategory = cat

updateCategoryUI(el)

const filtered = products.filter(p => p.category === cat)

renderCatalog(filtered)

}

list.appendChild(el)

})

}

function updateCategoryUI(active){

document.querySelectorAll(".category").forEach(c=>{
c.classList.remove("active")
})

active.classList.add("active")

}

function initSearch(){

const search = document.querySelector(".search")

if(!search) return

search.addEventListener("input", () => {

const text = search.value.toLowerCase()

let data = products

if(currentCategory !== "all"){

data = products.filter(p => p.category === currentCategory)

}

data = data.filter(p => {

const ru = (p.name_ru || "").toLowerCase()
const en = (p.name_en || "").toLowerCase()

return ru.includes(text) || en.includes(text)

})

renderCatalog(data)

})

}

function renderCatalog(data){

const grid = document.getElementById("catalog-grid")

if(!grid) return

grid.innerHTML = ""

data.forEach(p => {

const card = document.createElement("div")

card.className = "wine-card"

card.innerHTML = `

<div class="wine-type">${p.category || ""}</div>

<div class="wine-name-en">${p.name_en || ""}</div>

<div class="wine-name-ru">${p.name_ru}</div>

<div class="wine-style">${p.color || ""} ${p.style || ""}</div>

<div class="wine-price">${p.price} ₽</div>

<a class="wine-btn">Подробнее</a>

`

grid.appendChild(card)

})

}

initCatalog()