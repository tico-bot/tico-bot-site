'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const catalogSource = fs.readFileSync(path.join(root, 'Js', 'admin-inventario-catalogo.js'), 'utf8');
const adminHtml = fs.readFileSync(path.join(root, 'admin.html'), 'utf8');

function carregarCatalogo() {
  const window = {};
  vm.runInNewContext(catalogSource, { window });
  return window.TICO_ADMIN_ITEM_CATALOG;
}

test('o catálogo administrativo contém todas as áreas e itens do jogo', () => {
  const areas = carregarCatalogo();
  assert.equal(areas.length, 17);
  assert.equal(areas.reduce((total, area) => total + area.itens.length, 0), 187);
  assert.ok(areas.every(area => area.id && area.label && area.itens.length > 0));
  assert.ok(areas.every(area => area.itens.every(item => item.key && item.nome)));
});

test('as áreas de loja, pesca, roubo, segurança e casal estão separadas', () => {
  const ids = new Set(carregarCatalogo().map(area => area.id));
  for (const id of [
    'loja-comida', 'loja-petcomida', 'loja-petbrinquedo', 'loja-petcuidado',
    'loja-petacessorio', 'loja-especial', 'loja-pet', 'loja-casal',
    'loja-estilo', 'loja-tec', 'pesca-varas', 'pesca-iscas', 'pesca-achados',
    'roubo-ferramentas', 'roubo-banco', 'seguranca', 'casal-equipaveis',
  ]) assert.ok(ids.has(id), `área ausente: ${id}`);
});

test('a interface selecciona primeiro a área e depois um item do catálogo', () => {
  assert.match(adminHtml, /src="Js\/admin-inventario-catalogo\.js"/);
  assert.match(adminHtml, /id="usr-inv-item-area"/);
  assert.match(adminHtml, /id="usr-inv-item-nome" disabled/);
  assert.match(adminHtml, /id="usr-inv-item-personalizado"/);
  assert.match(adminHtml, /inicializarCatalogoInventario\(\)/);
  assert.match(adminHtml, /item: nomeItem, quantidade: qtd/);
});

test('o campo de catálogo deixou de ser um campo de texto livre', () => {
  assert.match(adminHtml, /<select id="usr-inv-item-nome" disabled>/);
  assert.doesNotMatch(adminHtml, /<input type="text" id="usr-inv-item-nome"/);
});
