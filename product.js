const params = new URLSearchParams(location.search)
const id = params.get("id")

fetch("data/products.json")
.then(r => r.json())
.then(data => {

const wine = data.find(p => p.id == id)

const image = document.getElementById("product-image")
const info = document.getElementById("product-info")

image.innerHTML = `
<img class="product-img" src="${wine.image}">
`

info.innerHTML = `

<h1>${wine.name}</h1>

<div class="product-type">${wine.type}</div>

<div class="wine-price">${wine.price} ₽</div>

<div class="product-desc">

<p>
Гармоничное вино с фруктовым ароматом и
хорошим балансом кислотности.
</p>

<h3>Гастрономия</h3>

<ul>
<li>рыба</li>
<li>морепродукты</li>
<li>белое мясо</li>
<li>сыры</li>
</ul>

</div>
`

const related = data
.filter(p => p.category === wine.category && p.id != wine.id)
.slice(0,4)

const grid = document.getElementById("related-grid")

related.forEach(p => {

const card = document.createElement("div")

card.className = "wine-card"

card.innerHTML = `

<img src="${p.image}">

<div class="wine-title">${p.name}</div>

<div class="wine-price">${p.price} ₽</div>

<a class="wine-btn" href="product.html?id=${p.id}">
Открыть
</a>

`

grid.appendChild(card)

})

})