async function loadProduct(){

const params=new URLSearchParams(window.location.search)

const id=parseInt(params.get("id"))

const res=await fetch("data/products.json")

const products=await res.json()

const product=products.find(p=>p.id===id)

document.getElementById("productTitle").innerText=product.name

document.getElementById("productType").innerText=product.type

document.getElementById("productPrice").innerText=product.price+" ₽"

document.getElementById("productDesc").innerText=
"Описание вина скоро появится."

}

loadProduct()