let products = []
let filtered = []

async function loadProducts() {

const res = await fetch("/data/products.json")
products = await res.json()

filtered = products

renderProducts(filtered)

}

function renderProducts(list){

const grid = document.getElementById("catalogGrid")

if(!grid) return

grid.innerHTML = ""

list.forEach(p=>{

const card = document.createElement("div")
card.className="product-card"

const image = p.image
? p.image
: "/assets/wine.jpg"

card.innerHTML=`

<img class="wine-img"
src="${image}"
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