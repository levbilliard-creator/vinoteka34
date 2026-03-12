const fs = require("fs")

const products = JSON.parse(
fs.readFileSync("data/products.json","utf8")
)

function detectCategory(name){

const text = name.toLowerCase()

if(text.includes("сыр")) return "бакалея"
if(text.includes("горгонзола")) return "бакалея"
if(text.includes("приправа")) return "бакалея"
if(text.includes("соус")) return "бакалея"
if(text.includes("чай")) return "чай"

if(text.includes("виски")) return "крепкий алкоголь"
if(text.includes("коньяк")) return "крепкий алкоголь"
if(text.includes("ром")) return "крепкий алкоголь"
if(text.includes("бренди")) return "крепкий алкоголь"

if(text.includes("шампан")) return "игристое"
if(text.includes("prosecco")) return "игристое"

return "вино"

}

function cleanName(name){

return name
.replace(/с защищенным наименованием места происхождения/gi,"")
.replace(/вино сортовое марочное/gi,"")
.replace(/столовое/gi,"")
.replace(/,/g,"")
.trim()

}

const cleaned = products.map(p=>{

const name = cleanName(p.name_ru)

return {

id:p.id,

category:detectCategory(name),

name_ru:name,

name_en:p.name_en || "",

color:p.color || "",

style:p.style || "",

price:p.price

}

})

fs.writeFileSync(
"data/products_clean.json",
JSON.stringify(cleaned,null,2)
)

console.log("Каталог очищен")