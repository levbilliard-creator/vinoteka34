async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  // --- грузим товары ---
  const res = await fetch('/data/products.json');
  const products = await res.json();

  const product = products.find(p => String(p.id) === id);

  if (!product) {
    document.body.innerHTML = '<h1>Товар не найден</h1>';
    return;
  }

  // --- НОРМАЛИЗАЦИЯ НАЗВАНИЯ ---
  function normalize(str) {
    return str
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9]/gi, '');
  }

  // --- СПИСОК ФАЙЛОВ (через попытки загрузки) ---
  async function findImage(name) {
    const base = normalize(name);

    // список возможных файлов (расширяем)
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

    // попробуем все файлы из папки (перебор по известным именам)
    // ВАЖНО: браузер не может читать папку → поэтому делаем через "угадывание"
    
    const possibleNames = [
      name,
      name.replace(/,/g, ''),
      name.replace(/\s+/g, ' '),
      name.replace(/\./g, ''),
      name.replace(/л/g, 'л'),
    ];

    // добавим урезанные варианты
    const words = name.split(' ');
    if (words.length > 2) {
      possibleNames.push(words.slice(0, 3).join(' '));
      possibleNames.push(words.slice(0, 2).join(' '));
    }

    for (let variant of possibleNames) {
      const clean = variant.trim();

      for (let ext of extensions) {
        const url = `/assets/wines/${clean}${ext}`;

        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) return url;
        } catch (e) {}
      }
    }

    return '/assets/no-image.png';
  }

  const imageUrl = await findImage(product.name);

  // --- ВСТАВКА В HTML ---
  document.querySelector('.product-image').innerHTML = `
    <img src="${imageUrl}" alt="${product.name}">
  `;

  document.querySelector('.product-category').textContent = product.category || 'ВИНО';
  document.querySelector('.product-title').textContent = product.name;
  document.querySelector('.product-subtitle').textContent = product.subtitle || '';
  document.querySelector('.product-price').textContent = product.price + ' ₽';

  document.querySelector('.product-description').textContent =
    product.description || 'Описание скоро появится';

  // --- ХАРАКТЕРИСТИКИ ---
  const specs = document.querySelector('.product-specs');
  if (specs && product.specs) {
    specs.innerHTML = Object.entries(product.specs)
      .map(([key, value]) => `
        <div class="spec-row">
          <span>${key}</span>
          <span>${value}</span>
        </div>
      `).join('');
  }
}

loadProduct();