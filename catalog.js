let products = []

async function loadCatalog(){

const response = await fetch("data/products.json")

products = await response.json()

renderCatalog(products)

}



function cleanName(name){

if(!name) return ""

let cleaned = name

cleaned = cleaned
.replace(/вино/gi,"")
.replace(/сортовое/gi,"")
.replace(/марочное/gi,"")
.replace(/столовое/gi,"")

.replace(/белое/gi,"")
.replace(/красное/gi,"")
.replace(/розовое/gi,"")

.replace(/сухое/gi,"")
.replace(/полусухое/gi,"")
.replace(/полусладкое/gi,"")
.replace(/сладкое/gi,"")

cleaned = cleaned.replace(/\s+/g," ").trim()

return cleaned

}



function transliterate(text){

const map = {

"а":"a","б":"b","в":"v","г":"g","д":"d",
"е":"e","ё":"e","ж":"zh","з":"z","и":"i",
"й":"y","к":"k","л":"l","м":"m","н":"n",
"о":"o","п":"p","р":"r","с":"s","т":"t",
"у":"u","ф":"f","х":"h","ц":"ts","ч":"ch",
"ш":"sh","щ":"sch","ы":"y","э":"e","ю":"yu",
"я":"ya"

}

return text
.toLowerCase()
.split("")
.map(char => map[char] || char)
.join("")

}



function detectCountry(name){

name = name.toLowerCase()

if(name.includes("rioja")) return "Spain"
if(name.includes("barolo")) return "Italy"
if(name.includes("chianti")) return "Italy"
if(name.includes("amarone")) return "Italy"
if(name.includes("prosecco")) return "Italy"

if(name.includes("bordeaux")) return "France"
if(name.includes("chablis")) return "France"
if(name.includes("sancerre")) return "France"
if(name.includes("muscadet")) return "France"

if(name.includes("marlborough")) return "New Zealand"
if(name.includes("mendoza")) return "Argentina"

return ""

}



function detectGrape(name){

name = name.toLowerCase()

if(name.includes("pinot")) return "Pinot Noir"
if(name.includes("chardonnay")) return "Chardonnay"
if(name.includes("sauvignon")) return "Sauvignon Blanc"
if(name.includes("merlot")) return "Merlot"
if(name.includes("cabernet")) return "Cabernet Sauvignon"
if(name.includes("riesling")) return "Riesling"
if(name.includes("malbec")) return "Malbec"
if(name.includes("tempranillo")) return "Tempranillo"
if(name.includes("sangiovese")) return "Sangiovese"

return ""

}



function processCatalog(){

const updated = products.map(p => {

const cleaned = cleanName(p.name)

const en = transliterate(cleaned)

const country = detectCountry(en)

const grape = detectGrape(en)

return {

...p,

name: cleaned,
name_en: en,
country: country,
grape: grape

}

})

const blob = new Blob(
[JSON.stringify(updated,null,2)],
{type:"application/json"}
)

const a = document.createElement("a")

a.href = URL.createObjectURL(blob)

a.download = "products_ready.json"

a.click()

}



function renderCatalog(list){

const container =
document.getElementById("catalog-grid")

container.innerHTML = ""

list.forEach(product => {

const card = document.createElement("div")

card.className = "product-card"

card.innerHTML = `

<div class="product-type">
${product.type || ""}
</div>

<div class="product-name-en">
${product.name_en || ""}
</div>

<div class="product-name">
${product.name}
</div>

<div class="product-price">
${product.price} ₽
</div>

<a href="product.html?id=${product.id}" class="product-btn">
Подробнее
</a>

`

container.appendChild(card)

})

}



document
.getElementById("processBtn")
.addEventListener("click",processCatalog)



loadCatalog()