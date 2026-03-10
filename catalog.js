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

function detectEnglish(name){

const latin =
name.match(/[A-Za-z].*/)

if(latin) return latin[0]

return ""

}

function renderCatalog(list){

const container =
document.getElementById("catalog-grid")

container.innerHTML = ""

list.forEach(product => {

const id = product.id

const ruName =
cleanWineName(product.name)

const enName =
product.name_en || ""

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

<div class="product-name-en">
${enName}
</div>

<div class="product-name">
${ruName}
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

function addEnglishNames(){

const updated =
products.map(p => {

const cleaned =
cleanWineName(p.name)

const en =
detectEnglish(cleaned)

return {
...p,
name: cleaned,
name_en: en
}

})

const blob =
new Blob(
[JSON.stringify(updated,null,2)],
{type:"application/json"}
)

const a =
document.createElement("a")

a.href =
URL.createObjectURL(blob)

a.download =
"products_with_en.json"

a.click()

}

document
.getElementById("addEnglishBtn")
.addEventListener("click", addEnglishNames)

loadCatalog()