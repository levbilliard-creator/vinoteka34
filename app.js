async function loadFeatured(){

const res = await fetch("data/products.json")

const products = await res.json()

const featured = products.slice(0,6)

const grid = document.getElementById("featuredGrid")

featured.forEach(p=>{

const card = document.createElement("div")

card.className="catalog-card"

card.innerHTML=`

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

card.querySelector("button").onclick=()=>{

window.location.href="/product.html?id="+p.id

}

grid.appendChild(card)

})

}

function cleanName(name){

return name
.replace(/Вино/i,"")
.replace(/сортовое|марочное|столовое/gi,"")
.replace(/красное|белое|розовое/gi,"")
.replace(/сухое|полусухое|полусладкое|сладкое/gi,"")
.replace(/\s+/g," ")
.trim()

}

loadFeatured()