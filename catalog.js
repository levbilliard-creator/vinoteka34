// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let PRODUCTS = []
let IMAGES = {}

let CURRENT_CATEGORY = 'all'
let SEARCH_QUERY = ''


// ===== ЗАГРУЗКА =====
async function loadData(){
  try{
    const [productsRes, imagesRes] = await Promise.all([
      fetch('/data/products.json'),
      fetch('/data/images.json')
    ])

    PRODUCTS = await productsRes.json()
    IMAGES = await imagesRes.json()

    initFromURL()
    renderCatalog()

  }catch(e){
    console.error('Ошибка загрузки', e)
  }
}


// ===== ЧТЕНИЕ КАТЕГОРИИ ИЗ URL =====
function initFromURL(){
  const params = new URLSearchParams(window.location.search)
  const cat = params.get('cat')

  if(cat){
    CURRENT_CATEGORY = cat
  }
}


// ===== СОХРАНЕНИЕ КАТЕГОРИИ =====
function saveCategory(){
  localStorage.setItem('lastCategory', CURRENT_CATEGORY)
}


// ===== КАРТИНКА (СТАБИЛЬНО) =====
function getImage(product){

  if(IMAGES && IMAGES[product.id]){
    return `/assets/wines/${IMAGES[product.id]}`
  }

  return `/assets/wines/${product.id}.jpg`
}


// ===== ФИЛЬТР =====
function filterProducts(){

  return PRODUCTS.filter(p => {

    if(CURRENT_CATEGORY !== 'all'){
      if(mapCategory(p) !== CURRENT_CATEGORY) return false
    }

    if(SEARCH_QUERY){
      const text = (p.name_ru + ' ' + (p.name_en || '')).toLowerCase()
      if(!text.includes(SEARCH_QUERY)) return false
    }

    return true
  })
}


// ===== КАТЕГОРИИ =====
function mapCategory(p){

  const name = (p.name_ru || '').toLowerCase()

  if(name.includes('чипс') || name.includes('печенье') || name.includes('олив') || name.includes('анчоус') || name.includes('приправа') || name.includes('хлеб')){
    return 'grocery'
  }

  if(name.includes('чай') || name.includes('улун') || name.includes('пуэр')){
    return 'tea'
  }

  if(name.includes('вода') || name.includes('сок')){
    return 'soft'
  }

  if(name.includes('пиво')){
    return 'beer'
  }

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

  if(name.includes('игрист') || name.includes('шампан')){
    return 'sparkling'
  }

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

  renderScrollTopButton()
}


// ===== КНОПКА ↑ =====
function renderScrollTopButton(){

  let btn = document.getElementById('scrollTopBtn')

  if(!btn){
    btn = document.createElement('button')
    btn.id = 'scrollTopBtn'
    btn.textContent = '↑'

    btn.style.position = 'fixed'
    btn.style.bottom = '30px'
    btn.style.right = '30px'
    btn.style.padding = '12px 16px'
    btn.style.borderRadius = '12px'
    btn.style.border = 'none'
    btn.style.cursor = 'pointer'
    btn.style.background = 'linear-gradient(45deg,#7b5cff,#ff4ecd)'
    btn.style.color = '#fff'
    btn.style.fontSize = '18px'
    btn.style.display = 'none'
    btn.style.zIndex = '999'

    btn.onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    document.body.appendChild(btn)
  }

  window.addEventListener('scroll', () => {
    if(window.scrollY > 400){
      btn.style.display = 'block'
    } else {
      btn.style.display = 'none'
    }
  })
}


// ===== ОТКРЫТИЕ ТОВАРА =====
function openProduct(id){
  saveCategory()
  window.location.href = `/product.html?id=${id}`
}


// ===== УТИЛИТЫ =====
function formatPrice(p){
  return new Intl.NumberFormat('ru-RU').format(p) + ' ₽'
}

function cleanName(name){
  return (name || '')
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
    saveCategory()
    renderCatalog()
  })
})


// ===== СТАРТ =====
loadData()