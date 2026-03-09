async function loadFeatured(){

const res = await fetch("data/products.json")

const products = await res.json()

const grid = document.getElementById("featuredGrid")

const featured = products.slice(0,8)

featured.forEach(p=>{

const card = document.createElement("div")

card.className="catalog-card"

card.innerHTML=`

<div class="catalog-type">${p.type || ""}</div>

<div class="catalog-title">${p.name}</div>

<div class="catalog-price">${p.price} ₽</div>

<button class="catalog-btn">Открыть</button>

`

card.querySelector("button").onclick=()=>{

window.location.href="/product.html?id="+p.id

}

grid.appendChild(card)

})

}

loadFeatured()