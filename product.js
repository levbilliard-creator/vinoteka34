const params=new URLSearchParams(location.search)

const id=params.get("id")

fetch("data/products.json")
.then(r=>r.json())
.then(data=>{

const product=data.find(p=>p.id==id)

const image=document.getElementById("product-image")
const info=document.getElementById("product-info")

image.innerHTML=`

<img src="${product.image}">

`

info.innerHTML=`

<h1>${product.name}</h1>

<p>${product.type}</p>

<div class="wine-price">${product.price} ₽</div>

`

const related=data
.filter(p=>p.category===product.category && p.id!=product.id)
.slice(0,4)

const grid=document.getElementById("related-grid")

related.forEach(p=>{

const card=document.createElement("div")

card.className="wine-card"

card.innerHTML=`

<img src="${p.image}">

<div class="wine-title">${p.name}</div>

<div class="wine-price">${p.price} ₽</div>

<a class="wine-btn" href="/product?id=${p.id}">
Открыть
</a>

`

grid.appendChild(card)

})

})