'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'Js', 'api-config.js'), 'utf8');
const PROD = 'https://tico-bot-6jpn.onrender.com/api';

function runConfig({ pathname = '/perfil.html', search = '', hostname = 'tico-bot.github.io', saved = null } = {}) {
  const store = new Map(saved ? [['tico_api_base', saved]] : []);
  const sessionStorage = {
    getItem(key) { return store.get(key) ?? null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); },
  };
  const window = {
    location: { pathname, search, hostname },
  };
  vm.runInNewContext(source, { window, sessionStorage, URL, URLSearchParams });
  return { window, store };
}

test('link mágico de perfil guarda a API HTTPS temporária do bot local', () => {
  const { window, store } = runConfig({
    pathname: '/tico-bot-site/perfil.html',
    search: '?token=abc123&api=https%3A%2F%2Fquiet-river.trycloudflare.com%2Fapi',
  });
  assert.equal(window.TICO_API_BASE, 'https://quiet-river.trycloudflare.com/api');
  assert.equal(store.has('tico_api_base'), false, 'a origem só é memorizada depois da validação do perfil');
  assert.equal(window.confirmarApiLocalTico(), true);
  assert.equal(store.get('tico_api_base'), window.TICO_API_BASE);
});

test('a API local é reutilizada noutras páginas do mesmo site', () => {
  const { window } = runConfig({
    pathname: '/tico-bot-site/index.html',
    saved: 'https://quiet-river.trycloudflare.com/api',
  });
  assert.equal(window.TICO_API_BASE, 'https://quiet-river.trycloudflare.com/api');
});

test('não aceita API recebida fora do link mágico nem hosts arbitrários', () => {
  const { window, store } = runConfig({
    pathname: '/login.html',
    search: '?api=https%3A%2F%2Fevil.example%2Fapi',
  });
  assert.equal(window.TICO_API_BASE, PROD);
  assert.equal(store.has('tico_api_base'), false);
});

test('rejeita host malicioso mesmo dentro de um link mágico', () => {
  const { window, store } = runConfig({
    pathname: '/perfil.html',
    search: '?token=abc123&api=https%3A%2F%2Fevil.example%2Fapi',
  });
  assert.equal(window.TICO_API_BASE, PROD);
  assert.equal(store.has('tico_api_base'), false);
});

test('em desenvolvimento servido localmente, usa a API localhost', () => {
  const { window } = runConfig({ pathname: '/perfil.html', hostname: 'localhost' });
  assert.equal(window.TICO_API_BASE, 'http://localhost:3000/api');
});

test('todas as páginas ligadas à API carregam a configuração compartilhada', () => {
  const root = path.join(__dirname, '..');
  const paginas = [
    ['index.html', 'Js/api-config.js'],
    ['perfil.html', 'Js/api-config.js'],
    ['login.html', 'Js/api-config.js'],
    ['cadastro.html', 'Js/api-config.js'],
    ['recuperar.html', 'Js/api-config.js'],
    ['admin.html', 'Js/api-config.js'],
    ['Jogos/cassino.html', '../Js/api-config.js'],
    ['Jogos/corrida.html', '../Js/api-config.js'],
  ];

  for (const [arquivo, script] of paginas) {
    const html = fs.readFileSync(path.join(root, arquivo), 'utf8');
    assert.ok(html.includes(`src="${script}"`), `${arquivo} deve carregar api-config.js`);
    assert.match(html, /const API = window\.TICO_API_BASE/);
  }
});
