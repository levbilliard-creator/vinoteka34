let products=[]

async function loadProducts(){

const res=await fetch("/data/products.json")
products=await res.json()

render(products)

}

function render(list){

const grid=document.getElementById("catalogGrid")

grid.innerHTML=""

list.forEach(p=>{

const card=document.createElement("div")
card.className="product-card"

card.innerHTML=`

<img class="wine-img"
src="${p.image || "/assets/wine.jpg"}"
loading="lazy"
onerror="this.src='/assets/wine.jpg'"
>

<div class="wine-type">
${p.category || "Вино"}
</div>

<div class="wine-en">
${p.name_en || ""}
</div>

<div class="wine-ru">
${p.name_ru}
</div>

<div class="wine-style">
${p.color || ""} ${p.style || ""}
</div>

<div class="wine-footer">

<span class="wine-price">
${p.price ? p.price+" ₽" : ""}
</span>

<a href="/product?id=${p.id}">
Подробнее
</a>

</div>
`

grid.appendChild(card)

})

}

loadProducts()