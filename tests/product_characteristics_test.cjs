const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const {readFileSync} = require('node:fs');
const source = readFileSync(new URL('../product.js', 'file://' + __filename), 'utf8');

async function render(product) {
  const nodes = new Map();
  const get = selector => {
    if (!nodes.has(selector)) nodes.set(selector, {
      children: [], addEventListener() {},
      replaceChildren(...children) { this.children = children; },
      append(...children) { this.children.push(...children); }
    });
    return nodes.get(selector);
  };
  vm.runInNewContext(source, {
    URLSearchParams, location: {search: '?id=1'},
    document: {getElementById: id => get('#' + id), querySelector: get},
    window: {Vino: {
      typeOf: () => 'strong', catalogURL: () => '/catalog.html',
      loadProducts: async () => [product], priceOf: () => '100 ₽',
      makeImage: () => ({}), types: {strong: 'Крепкий алкоголь'},
      element: (tag, className, textContent) => ({tag, className, textContent,
        children: [], append(...children) { this.children.push(...children); }})
    }}
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(get('#productContent').hidden, false);
  return {fields: Object.fromEntries(get('.product-specs').children.map(row =>
    row.children.map(child => child.textContent))), nodes};
}

test('spirits show exact composition and distinguish minimum age from maturation information', async () => {
  const {fields, nodes} = await render({id: 1, name_ru: 'Тест', type: 'strong', kind: 'Виски',
    raw_material: 'Ячменный солод', aroma: 'Ваниль', taste: 'Фрукты',
    minimum_age: 'Не менее 10 лет', ageing: 'Бочки из-под бурбона'});
  assert.equal(fields['Сырьё и основа'], 'Ячменный солод');
  assert.equal(fields['Минимальная выдержка'], 'Не менее 10 лет');
  assert.equal(fields['Выдержка'], 'Бочки из-под бурбона');
  assert.equal(fields['Аромат'], 'Ваниль');
  assert.equal(fields['Вкус'], 'Фрукты');
  assert.ok(!('Сортовой состав' in fields));
  assert.equal(nodes.get('#productDescription').hidden, true);
});

test('grape spirits capitalize each variety and do not invent absent age or tasting notes', async () => {
  const {fields} = await render({id: 1, name_ru: 'Тест', type: 'strong', kind: 'Арманьяк',
    grape: 'уни блан, бако', ageing: 'Миллезим 1986; дата розлива не подтверждена'});
  assert.equal(fields['Сортовой состав'], 'Уни блан, Бако');
  assert.ok(!('Минимальная выдержка' in fields));
  assert.ok(!('Аромат' in fields));
  assert.ok(!('Сырьё и основа' in fields));
});
