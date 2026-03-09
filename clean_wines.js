const fs = require("fs")

const file = "data/products.json"

let products = JSON.parse(fs.readFileSync(file, "utf8"))

function cleanName(name){

return name
.replace(/Вино/gi,"")
.replace(/сортовое/gi,"")
.replace(/марочное/gi,"")
.replace(/столовое/gi,"")
.replace(/тихое/gi,"")
.replace(/виноградное/gi,"")
.replace(/\s+/g," ")
.trim()

}

products = products.map(p => {

p.name = cleanName(p.name)

return p

})

fs.writeFileSync(
"data/products_clean.json",
JSON.stringify(products,null,2)
)

console.log("✔ База очищена")