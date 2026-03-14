document.addEventListener("DOMContentLoaded", function () {

let products = []
let filteredProducts = []

const grid = document.getElementById("catalog-grid")
const searchInput = document.getElementById("search")

/* загрузка каталога */

async function loadCatalog(){

    try{

        const response = await fetch("/data/products.json")
        const data = await response.json()

        products = data
        filteredProducts = products

        renderCatalog()

    }catch(error){

        console.error("Ошибка загрузки каталога", error)

    }

}


/* отрисовка карточек */

function renderCatalog(){

    if(!grid) return

    grid.innerHTML = filteredProducts.map(product => `

        <div class="catalog-card">

            <div class="catalog-card-title">
                ${product.name_ru || ""}
            </div>

            <div class="catalog-card-price">
                ${product.price ? product.price + " ₽" : ""}
            </div>

            <a class="catalog-card-link" href="product.html?id=${product.id}">
                Подробнее
            </a>

        </div>

    `).join("")

}


/* поиск */

function searchProducts(){

    const value = searchInput.value.toLowerCase()

    filteredProducts = products.filter(product =>

        (product.name_ru || "").toLowerCase().includes(value) ||
        (product.name_en || "").toLowerCase().includes(value)

    )

    renderCatalog()

}


/* фильтр категорий */

function filterCategory(category){

    if(category === "all"){

        filteredProducts = products

    }

    else if(category === "wine"){

        filteredProducts = products.filter(p =>
            (p.type || "").toLowerCase().includes("вино")
        )

    }

    else if(category === "sparkling"){

        filteredProducts = products.filter(p =>
            (p.type || "").toLowerCase().includes("игрист")
        )

    }

    else if(category === "strong"){

        const strongTypes = [
            "коньяк",
            "виски",
            "ром",
            "водка",
            "текила",
            "джин",
            "бренди",
            "ликер",
            "настойка",
            "граппа",
            "арманьяк",
            "кальвадос"
        ]

        filteredProducts = products.filter(p => {

            const t = (p.type || "").toLowerCase()

            return strongTypes.some(type => t.includes(type))

        })

    }

    else if(category === "grocery"){

        filteredProducts = products.filter(p =>
            (p.type || "").toLowerCase().includes("бакале")
        )

    }

    else if(category === "tea"){

        filteredProducts = products.filter(p =>
            (p.type || "").toLowerCase().includes("чай")
        )

    }

    renderCatalog()

}


/* обработчики кнопок */

function initCategoryButtons(){

    const buttons = document.querySelectorAll("[data-filter]")

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter
            filterCategory(filter)

        })

    })

}


/* запуск */

if(searchInput){
    searchInput.addEventListener("input", searchProducts)
}

initCategoryButtons()
loadCatalog()

})