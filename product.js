async function loadProduct(){

const params = new URLSearchParams(window.location.search)
const id = Number(params.get("id"))

const res = await fetch("data/products.json")
const products = await res.json()

const wine = products.find(p=>p.id===id)

document.querySelector(".product-title").innerText = wine.name
document.querySelector(".product-price").innerText = wine.price + " ₽"
document.querySelector(".product-img").src = wine.image
document.querySelector(".product-desc").innerText = wine.region

}

loadProduct()