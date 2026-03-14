let products = []
let filtered = []

async function loadProducts() {

const response = await fetch("/data/products.json")

products = await response.json()

filtered = products

renderCatalog(filtered)

}

function renderCatalog(list) {

const grid = document.getElementById("catalog-grid")

grid.innerHTML = ""

list.forEach(product => {

const card = document.createElement("div")

card.className = "product-card"

card.innerHTML = `

<img src="/assets/photo_1_2026-02-15_15-47-16.jpg">

<div class="product-type">
${product.type || ""}
</div>

<div class="product-name">
${product.name_ru}
</div>

<div class="product-price">
${product.price} ₽
</div>

<button class="btn-card">
Подробнее
</button>

`

grid.appendChild(card)

})

}

function filterCategory(category){

let result = []

if(category === "all"){

result = products

}

else if(category === "wine"){

result = products.filter(p => p.type === "вино")

}

else if(category === "sparkling"){

result = products.filter(p =>
p.type.toLowerCase().includes("игрист")
)

}

else if(category === "strong"){

result = products.filter(p =>
p.type !== "вино" &&
!p.type.toLowerCase().includes("игрист")
)

}

else if(category === "food"){

result = products.filter(p =>
p.type === "бакалея"
)

}

else if(category === "tea"){

result = products.filter(p =>
p.type === "чай"
)

}

filtered = result

renderCatalog(filtered)

}

document.querySelectorAll(".filter-btn").forEach(button => {

button.addEventListener("click", () => {

document.querySelectorAll(".filter-btn")
.forEach(b => b.classList.remove("active"))

button.classList.add("active")

filterCategory(button.dataset.cat)

})

})

document.getElementById("search").addEventListener("input", e => {

const query = e.target.value.toLowerCase()

const result = filtered.filter(product =>
product.name_ru.toLowerCase().includes(query)
)

renderCatalog(result)

})

loadProducts()
