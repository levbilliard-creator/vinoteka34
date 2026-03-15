let products = []
let filtered = []
let activeCategory = "all"

async function loadProducts(){

const res = await fetch("/data/products.json")
products = await res.json()

filtered = products

renderProducts(filtered)

}

function normalizeCategory(p){

let cat = p.category || p.type || ""

cat = cat.toLowerCase()

if(cat.includes("вино")) return "wine"
if(cat.includes("wine")) return "wine"

if(cat.includes("игрист")) return "sparkling"
if(cat.includes("sparkling")) return "sparkling"

if(cat.includes("креп")) return "strong"
if(cat.includes("strong")) return "strong"

if(cat.includes("пиво")) return "beer"
if(cat.includes("beer")) return "beer"

if(cat.includes("soft")) return "soft"
if(cat.includes("безал")) return "soft"

if(cat.includes("бакале")) return "grocery"
if(cat.includes("grocery")) return "grocery"

if(cat.includes("чай")) return "tea"
if(cat.includes("tea")) return "tea"

if(cat.includes("аксесс")) return "accessories"
if(cat.includes("accessories")) return "accessories"

return "other"

}

function filterCategory(category){

activeCategory = category

if(category === "all"){
filtered = products
}
else{

filtered = products.filter(p => normalizeCategory(p) === category)

}

renderProducts(filtered)

}

function renderProducts(list){

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

list.forEach(p => {

const card = document.createElement("div")
card.className = "product-card"

card.innerHTML = `
<div class="product-type">${p.category || ""}</div>
<h3>${p.name_ru}</h3>
<div class="product-style">${p.color || ""} ${p.style || ""}</div>
<div class="product-bottom">
<span class="price">${p.price} ₽</span>
<a href="/product?id=${p.id}">Подробнее</a>
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