document.addEventListener("DOMContentLoaded", () => {

const grid = document.getElementById("catalog-grid")

if (!grid) return

fetch("data/products.json")
.then(res => res.json())
.then(products => {

render(products)

const filters = document.querySelectorAll(".drink-filter")

filters.forEach(btn => {

btn.addEventListener("click", () => {

filters.forEach(b => b.classList.remove("active"))
btn.classList.add("active")

const type = btn.dataset.filter

if (type === "all") {
render(products)
return
}

const filtered = products.filter(p => p.category === type)

render(filtered)

})

})

})

function render(products){

grid.innerHTML = ""

products.forEach(p => {

const card = document.createElement("div")
card.className = "wine-card"

card.innerHTML = `
<img src="${p.image}" alt="${p.name}">
<div class="wine-category">${p.category}</div>
<div class="wine-title">${p.name}</div>
<div class="wine-type">${p.type}</div>
<div class="wine-price">${p.price} ₽</div>
<a class="wine-btn" href="#">Открыть</a>
`

grid.appendChild(card)

})

}

})