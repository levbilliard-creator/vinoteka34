let products = []

async function loadCatalog(){

const response = await fetch("data/products.json")

products = await response.json()

renderCatalog(products)

}

function cleanWineName(name){

if(!name) return ""

let cleaned = name

cleaned = cleaned
.replace(/вино/gi,"")
.replace(/столовое/gi,"")
.replace(/сортовое/gi,"")
.replace(/марочное/gi,"")
.replace(/натуральное/gi,"")
.replace(/ординарное/gi,"")

.replace(/сухое/gi,"")
.replace(/полусухое/gi,"")
.replace(/полусладкое/gi,"")
.replace(/сладкое/gi,"")

.replace(/белое/gi,"")
.replace(/красное/gi,"")
.replace(/розовое/gi,"")
.replace(/игристое/gi,"")

cleaned = cleaned.replace(/\s+/g," ").trim()

return cleaned

}

function renderCatalog(list){

const container =
document.getElementById("catalog-grid")

container.innerHTML = ""

list.forEach(product => {

const id = product.id

const name =
cleanWineName(product.name)

const type =
product.type || ""

const price =
product.price || ""

const card =
document.createElement("div")

card.className =
"product-card"

card.innerHTML = `

<div class="product-type">
${type}
</div>

<div class="product-name">
${name}
</div>

<div class="product-price">
${price} ₽
</div>

<a href="product.html?id=${id}" class="product-btn">
Подробнее
</a>

`

container.appendChild(card)

})

}

function searchProducts(){

const text =
document.getElementById("search")
.value
.toLowerCase()

const filtered =
products.filter(p =>

(p.name || "")
.toLowerCase()
.includes(text)

)

renderCatalog(filtered)

}

document
.getElementById("search")
.addEventListener("input", searchProducts)



function cleanCatalog(){

const cleaned =
products.map(p => {

return {
...p,
name: cleanWineName(p.name)
}

})

const blob =
new Blob(
[JSON.stringify(cleaned,null,2)],
{type:"application/json"}
)

const a =
document.createElement("a")

a.href =
URL.createObjectURL(blob)

a.download =
"products_clean.json"

a.click()

}

document
.getElementById("cleanBtn")
.addEventListener("click", cleanCatalog)


loadCatalog()