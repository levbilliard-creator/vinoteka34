// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let PRODUCTS = []
let IMAGES = {}

let CURRENT_CATEGORY = 'all'
let SEARCH_QUERY = ''


// ===== ЗАГРУЗКА ДАННЫХ =====
async function loadData(){
  try{
    const [productsRes, imagesRes] = await Promise.all([
      fetch('/data/products.json'),
      fetch('/data/images.json')
    ])

    PRODUCTS = await productsRes.json()
    IMAGES = await imagesRes.json()

    renderCatalog()

  }catch(e){
    console.error('Ошибка загрузки данных', e)
  }
}


// ===== ПОЛУЧЕНИЕ КАРТИНКИ (СТАБИЛЬНО) =====
function getImage(product){

  // 1. через images.json
  if(IMAGES && IMAGES[product.id]){
    return `/assets/wines/${IMAGES[product.id]}`
  }

  // 2. fallback через ID
  return `/assets/wines/${product.id}.jpg`
}


// ===== ФИЛЬТР =====
function filterProducts(){

  return PRODUCTS.filter(p => {

    // категория
    if(CURRENT_CATEGORY !== 'all'){
      if(mapCategory(p) !== CURRENT_CATEGORY) return false
    }

    // поиск
    if(SEARCH_QUERY){
      const text = (p.name_ru + ' ' + (p.name_en || '')).toLowerCase()
      if(!text.includes(SEARCH_QUERY)) return false
    }

    return true
  })
}


// ===== КАТЕГОРИИ (ЖЁСТКАЯ ЛОГИКА) =====
function mapCategory(p){

  const name = p.name_ru.toLowerCase()

  // бакалея
  if(name.includes('чипс') || name.includes('печенье') || name.includes('олив') || name.includes('анчоус') || name.includes('приправа') || name.includes('хлебные') ){
    return 'grocery'
  }

  // чай
  if(name.includes('чай') || name.includes('улун') || name.includes('пуэр')){
    return 'tea'
  }

  // безалкогольные
  if(name.includes('вода') || name.includes('сок') || name.includes('напиток безалкогольный')){
    return 'soft'
  }

  // пиво
  if(name.includes('пиво')){
    return 'beer'
  }

  // крепкий алкоголь
  if(
    name.includes('виски') ||
    name.includes('ром') ||
    name.includes('текил') ||
    name.includes('джин') ||
    name.includes('коньяк') ||
    name.includes('бренди') ||
    name.includes('ракия')
  ){
    return 'strong'
  }

  // игристое
  if(name.includes('игрист') || name.includes('шампан')){
    return 'sparkling'
  }

  // всё остальное — вино
  return 'wine'
}


// ===== РЕНДЕР =====
function renderCatalog(){

  const container = document.getElementById('catalog')
  container.innerHTML = ''

  const items = filterProducts()

  items.forEach(product => {

    const card = document.createElement('div')
    card.className = 'card'

    const imgSrc = getImage(product)

    card.innerHTML = `
      <div class="card-img">
        <img src="${imgSrc}" loading="lazy"
          onerror="this.style.display='none'">
      </div>

      <div class="card-body">
        <div class="card-type">${getCategoryName(mapCategory(product))}</div>

        <div class="card-title">
          ${product.name_en ? `<div class="en">${product.name_en}</div>` : ''}
          <div class="ru">${cleanName(product.name_ru)}</div>
        </div>

        <div class="card-meta">
          ${product.color || ''} ${product.style || ''}
        </div>

        <div class="card-price">
          ${formatPrice(product.price)}
        </div>

        <button class="card-btn" onclick="openProduct(${product.id})">
          Подробнее →
        </button>
      </div>
    `

    container.appendChild(card)
  })
}


// ===== ОТКРЫТИЕ ТОВАРА =====
function openProduct(id){
  localStorage.setItem('lastCategory', CURRENT_CATEGORY)
  window.location.href = `/product.html?id=${id}`
}


// ===== УТИЛИТЫ =====
function formatPrice(p){
  return new Intl.NumberFormat('ru-RU').format(p) + ' ₽'
}

function cleanName(name){
  return name
    .replace(/вино/gi, '')
    .replace(/сортовое/gi, '')
    .replace(/марочное/gi, '')
    .replace(/ординарное/gi, '')
    .replace(/выдержанное/gi, '')
    .replace(/столовое/gi, '')
    .trim()
}

function getCategoryName(cat){
  const map = {
    wine: 'Вино',
    sparkling: 'Игристое',
    strong: 'Крепкий алкоголь',
    beer: 'Пиво',
    soft: 'Безалкогольные',
    grocery: 'Бакалея',
    tea: 'Чай'
  }
  return map[cat] || ''
}


// ===== СОБЫТИЯ =====
document.getElementById('search').addEventListener('input', e => {
  SEARCH_QUERY = e.target.value.toLowerCase()
  renderCatalog()
})

document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    CURRENT_CATEGORY = btn.dataset.cat
    renderCatalog()
  })
})


// ===== СТАРТ =====
loadData()