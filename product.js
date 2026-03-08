async function loadProduct(){

const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

const res = await fetch("data/products.json")
const products = await res.json()

const wine = products.find(p => p.id === id)

if(!wine) return

const name =
wine.name ||
wine.name_ru ||
wine.title ||
wine.product ||
""

const price =
wine.price ||
wine.cost ||
""

const image =
wine.image ||
wine.img ||
"img/wine.jpg"

const title = document.querySelector(".product-title")
const priceBox = document.querySelector(".product-price")
const img = document.querySelector(".product-img")

if(title) title.innerText = name
if(priceBox) priceBox.innerText = price + " ₽"
if(img) img.src = image

}

loadProduct()