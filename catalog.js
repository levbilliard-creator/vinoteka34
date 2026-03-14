let products = []
let filtered = []

async function loadProducts() {

const res = await fetch("/data/products.json")
products = await res.json()

filtered = products

renderCatalog(filtered)

}

function renderCatalog(list) {

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

list.forEach(p => {

const card = document.createElement("div")
card.className = "product-card"

card.innerHTML = `

<img src="/assets/photo_1_2026-02-15_15-47-16.jpg">

<div class="product-type">
${p.type || ""}
</div>

<div class="product-name">
${p.name_ru}
</div>

<div class="product-price">
${p.price} ₽
</div>

<button class="btn-card">
Подробнее
</button>

`

grid.appendChild(card)

})

}

function filterCategory(cat){

let list = []

if(cat === "all"){

list = products

}

else if(cat === "wine"){

list = products.filter(p => p.type === "вино")

}

else if(cat === "sparkling"){

list = products.filter(p =>
p.type.includes("игрист")
)

}

else if(cat === "strong"){

list = products.filter(p =>
p.type !== "вино" &&
p.type !== "игристое"
)

}

else if(cat === "food"){

list = products.filter(p =>
p.type === "бакалея"
)

}

else if(cat === "tea"){

list = products.filter(p =>
p.type === "чай"
)

}

filtered = list

renderCatalog(filtered)

}

document.querySelectorAll(".filter-btn").forEach(btn => {

btn.addEventListener("click", () => {

document.querySelectorAll(".filter-btn")
.forEach(b => b.classList.remove("active"))

btn.classList.add("active")

filterCategory(btn.dataset.cat)

})

})

document.getElementById("search").addEventListener("input", e => {

const q = e.target.value.toLowerCase()

const list = filtered.filter(p =>
p.name_ru.toLowerCase().includes(q)
)

renderCatalog(list)

})

loadProducts()
