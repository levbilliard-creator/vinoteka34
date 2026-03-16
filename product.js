let products = []



async function loadProduct(){

const params = new URLSearchParams(window.location.search)
const id = params.get("id")

const res = await fetch("/data/products.json")
products = await res.json()

const product = products.find(p => String(p.id) === String(id))

if(!product) return

renderProduct(product)
renderSimilar(product)

}



function getWineImage(name){

const query = encodeURIComponent(name + " wine label")

return `https://source.unsplash.com/400x600/?${query}`

}



function renderProduct(p){

const container = document.getElementById("productPage")

const imageUrl = getWineImage(p.name_en || p.name_ru)

container.innerHTML = `

<div class="productWrapper">

<div class="productImage">
<img
src="${imageUrl}"
class="wine-img-big"
onerror="this.src='https://dummyimage.com/600x600/163343/ffffff&text=Wine'"
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
${p.price ? p.price + " ₽" : ""}
</div>

<button class="wine-btn">
Спросить сомелье
</button>

</div>

</div>

`

}



function renderSimilar(product){

const grid = document.getElementById("similarGrid")

if(!grid) return

const similar = products
.filter(p => p.category === product.category && p.id !== product.id)
.slice(0,4)

grid.innerHTML = ""

similar.forEach(p => {

const imageUrl = getWineImage(p.name_en || p.name_ru)

const card = document.createElement("div")

card.className = "product-card"

card.innerHTML = `

<img
class="wine-img"
src="${imageUrl}"
onerror="this.src='https://dummyimage.com/300x200/163343/ffffff&text=Wine'"
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
${p.price ? p.price + " ₽" : ""}
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