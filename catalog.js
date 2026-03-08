let products = []
let currentType = "all"

async function loadCatalog(){

const res = await fetch("data/products.json")
products = await res.json()

renderCatalog()

}

function renderCatalog(){

const grid = document.getElementById("catalogGrid")

grid.innerHTML=""

let filtered = products

if(currentType !== "all"){

filtered = products.filter(p => p.category === currentType)

}

filtered.forEach(p=>{

const card = document.createElement("div")

card.className = "catalog-card"

card.innerHTML = `

<div class="catalog-type">
${p.type || ""}
</div>

<div class="catalog-title">
${cleanName(p.name)}
</div>

<div class="catalog-price">
${p.price} ₽
</div>

<button class="catalog-btn">
Открыть
</button>

`

card.querySelector("button").onclick = () => {

window.location.href="/product.html?id="+p.id

}

grid.appendChild(card)

})

}

document.querySelectorAll(".filter").forEach(btn=>{

btn.onclick = ()=>{

document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

currentType = btn.dataset.type

renderCatalog()

}

})

function cleanName(name){

return name
.replace(/Вино/i,"")
.replace(/сортовое|марочное|столовое/gi,"")
.replace(/красное|белое|розовое/gi,"")
.replace(/сухое|полусухое|полусладкое|сладкое/gi,"")
.replace(/\s+/g," ")
.trim()

}

loadCatalog()