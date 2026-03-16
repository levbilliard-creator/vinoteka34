let products = []
let filteredProducts = []
let activeCategory = "all"

async function loadProducts(){

const res = await fetch("/data/products.json")
products = await res.json()

filteredProducts = products

renderProducts(filteredProducts)

}

function normalizeCategory(p){

let cat = (p.category || p.type || "").toLowerCase()

if(cat.includes("wine") || cat.includes("вино")) return "wine"
if(cat.includes("sparkling") || cat.includes("игрист")) return "sparkling"
if(cat.includes("strong") || cat.includes("креп")) return "strong"
if(cat.includes("beer") || cat.includes("пиво")) return "beer"
if(cat.includes("soft") || cat.includes("безал")) return "soft"
if(cat.includes("grocery") || cat.includes("бакале")) return "grocery"
if(cat.includes("tea") || cat.includes("чай")) return "tea"
if(cat.includes("accessories") || cat.includes("аксесс")) return "accessories"

return "other"

}

function translateCategory(cat){

if(cat === "wine") return "Вино"
if(cat === "sparkling") return "Игристое"
if(cat === "strong") return "Крепкий алкоголь"
if(cat === "beer") return "Пиво"
if(cat === "soft") return "Безалкогольные"
if(cat === "grocery") return "Бакалея"
if(cat === "tea") return "Чай"
if(cat === "accessories") return "Аксессуары"

return ""

}

function filterCategory(category){

activeCategory = category

if(category === "all"){
filteredProducts = products
}
else{

filteredProducts = products.filter(p => normalizeCategory(p) === category)

}

renderProducts(filteredProducts)

}

function renderProducts(list){

const grid = document.getElementById("catalogGrid")

if(!grid) return

grid.innerHTML = ""

list.forEach(p => {

const category = normalizeCategory(p)
const categoryLabel = translateCategory(category)

const card = document.createElement("div")
card.className = "product-card"

card.innerHTML = `

<div class="wine-type">
${categoryLabel}
</div>

<div class="wine-names">

<div class="wine-en">
${p.name_en || ""}
</div>

<div class="wine-ru">
${p.name_ru || ""}
</div>

</div>

<div class="wine-style">
${(p.color || "") + " " + (p.style || "")}
</div>

<div class="wine-footer">

<span class="wine-price">
${p.price ? p.price + " ₽" : ""}
</span>

<a href="/product?id=${p.id}">
Подробнее
</a>

</div>

`

grid.appendChild(card)

})

}

document.querySelectorAll(".cat-btn").forEach(btn => {

btn.addEventListener("click", () => {

filterCategory(btn.dataset.cat)

})

})

loadProducts()