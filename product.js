let products=[]

async function loadProduct(){

const params=new URLSearchParams(location.search)
const id=params.get("id")

const res=await fetch("/data/products.json")
products=await res.json()

const product=products.find(p=>String(p.id)===String(id))

if(!product) return

renderProduct(product)
renderSimilar(product)

}

function renderProduct(p){

const container=document.getElementById("productPage")

const image=p.image
? p.image
: "/assets/wine.jpg"

container.innerHTML=`

<div class="productWrapper">

<div class="productImage">
<img
src="${image}"
class="wine-img-big"
onerror="this.src='/assets/wine.jpg'"
>
</div>

<div class="productInfo">

<div class="wine-type">
${p.category || "Вино"}
</div>

<h1 class="wine-title">
${p.name_ru}
</h1>

<div class="wine-en">
${p.name_en || ""}
</div>

<div class="wine-style">
${p.color || ""} ${p.style || ""}
</div>

<div class="wine-price-big">
${p.price ? p.price+" ₽" : ""}
</div>

<button class="wine-btn">
Спросить сомелье
</button>

</div>

</div>

`

}

function renderSimilar(product){

const grid=document.getElementById("similarGrid")

if(!grid) return

const similar=products
.filter(p=>p.category===product.category && p.id!==product.id)
.slice(0,4)

grid.innerHTML=""

similar.forEach(p=>{

const card=document.createElement("div")
card.className="product-card"

const image=p.image
? p.image
: "/assets/wine.jpg"

card.innerHTML=`

<img class="wine-img"
src="${image}"
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

loadProduct()