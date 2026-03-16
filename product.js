async function loadProduct(){

const params = new URLSearchParams(location.search)
const id = params.get("id")

const res = await fetch("/data/products.json")
const products = await res.json()

const p = products.find(w => String(w.id) === id)

render(p)

}

function wineImage(name){

const q = encodeURIComponent(name)

return "https://source.unsplash.com/600x800/?wine," + q

}

function render(p){

const image = wineImage(p.name_en || p.name_ru)

const container = document.getElementById("productPage")

container.innerHTML = `

<div class="productWrapper">

<div class="productImage">

<img class="wine-img-big"
src="${image}"
onerror="this.src='/assets/wine.jpg'">

</div>

<div class="productInfo">

<div class="wine-type">
${p.category || "Вино"}
</div>

<h1>
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

loadProduct()