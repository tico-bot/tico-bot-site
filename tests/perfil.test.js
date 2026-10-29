'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'perfil.html'), 'utf8');
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(script => script.trim());

assert.equal(inlineScripts.length, 1, 'perfil.html deve conter um script inline principal');

function createContext(options = {}) {
  const elements = new Map();
  const redirects = [];
  const makeElement = (id) => ({
    id,
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      values: new Set(['hidden']),
      add(value) { this.values.add(value); },
      remove(value) { this.values.delete(value); },
      contains(value) { return this.values.has(value); },
    },
    replaceChildren() { this.innerHTML = ''; this.textContent = ''; },
    listeners: new Map(),
    addEventListener(event, handler) { this.listeners.set(event, handler); },
    getContext() { return {}; },
  });
  const storage = () => ({
    data: new Map(),
    getItem(key) { return this.data.has(key) ? this.data.get(key) : null; },
    setItem(key, value) { this.data.set(key, String(value)); },
    removeItem(key) { this.data.delete(key); },
  });
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, makeElement(id));
        return elements.get(id);
      },
    },
    window: {
      location: {
        hostname: 'site.example',
        search: options.search || '',
        origin: 'https://site.example',
        pathname: '/perfil.html',
        replace(url) { redirects.push(url); },
      },
    },
    history: { replaceState() {} },
    localStorage: storage(),
    sessionStorage: storage(),
    URLSearchParams,
    Date,
    Intl,
    Math,
    Number,
    String,
    Array,
    Object,
    Set,
    Map,
    Promise,
    requestAnimationFrame(callback) { callback(); },
    setTimeout(callback) { callback(); return 1; },
    clearTimeout() {},
    confirm() { return false; },
    alert() {},
    fetch: options.fetchImpl || (() => { throw new Error('fetch não deveria ser chamado neste teste'); }),
  };
  const context = vm.createContext(sandbox);
  let script = inlineScripts[0];
  if (options.captureInit) {
    const chamadasInit = script.match(/\n\s*init\(\);\s*$/);
    assert.ok(chamadasInit, 'chamada de inicialização deve existir no fim do script');
    script = script.replace(/\n\s*init\(\);\s*$/, '\n    globalThis.__initPromise = init();');
  }
  vm.runInContext(script, context, { filename: 'perfil.html' });
  return { context, elements, redirects };
}

test('formata números inválidos e valores negativos sem mostrar NaN', () => {
  const { context } = createContext();
  assert.equal(vm.runInContext("fmtNum('invalido')", context), '0');
  assert.equal(vm.runInContext('fmtNum(Infinity)', context), '0');
  assert.equal(vm.runInContext('fmtNum(-1200)', context), '-1.2k');
  assert.equal(vm.runInContext('fmtNum(1250)', context), '1.3k');
});

test('rejeita datas inválidas e escapa caracteres HTML', () => {
  const { context } = createContext();
  assert.equal(vm.runInContext("fmtData('data-invalida')", context), null);
  assert.equal(
    vm.runInContext("escapeHtml('<img src=x onerror=alert(1)>')", context),
    '&lt;img src=x onerror=alert(1)&gt;'
  );
});

test('renderiza nomes de grupos como texto seguro e trata valores inválidos', () => {
  const { context, elements } = createContext();
  context.gruposTeste = [{
    jid: '120363409568918044@g.us',
    nome: '<img src=x onerror=alert(1)>',
    level: 'invalido',
    xp: 'NaN',
    gold: 352,
    mensagens: 0,
  }];
  vm.runInContext('renderGrupos(gruposTeste)', context);
  const grid = elements.get('grupos-grid');
  assert.match(grid.innerHTML, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(grid.innerHTML, /<img src=x onerror/);
  assert.match(grid.innerHTML, /Nível/);
  assert.match(grid.innerHTML, />0</);

  vm.runInContext('renderGrupos([])', context);
  assert.equal(grid.innerHTML, '');
  assert.equal(elements.get('grupos-vazio').classList.contains('hidden'), false);
});

test('normaliza e escapa dados do pet antes de montar o cartão', () => {
  const { context, elements } = createContext();
  context.petTeste = {
    nome: '<svg onload=alert(1)>',
    type: '<img src=x>',
    rarity: { invalid: true },
    level: '<b>999</b>',
    energy: 999,
    fullness: -5,
    happiness: 'invalido',
  };
  vm.runInContext('renderPet(petTeste)', context);
  const card = elements.get('pet-card');
  assert.match(card.innerHTML, /&lt;svg onload=alert\(1\)&gt;/);
  assert.match(card.innerHTML, /🐾/);
  assert.doesNotMatch(card.innerHTML, /<img src=x>/);
  assert.doesNotMatch(card.innerHTML, /src="<img/);
  assert.match(card.innerHTML, /Nível 1/);
  assert.match(card.innerHTML, /width:100%;background:#ff6482/);
  assert.match(card.innerHTML, /width:0%;background:#ffd060/);

  vm.runInContext('renderPet(null)', context);
  assert.equal(card.innerHTML, '');
  assert.equal(elements.get('pet-vazio').classList.contains('hidden'), false);
});

test('renderiza a imagem real do pet e usa um caminho estático conhecido', () => {
  const { context, elements } = createContext();
  context.petTeste = {
    name: 'Miau', type: 'bolsonaro', rarity: 'RARO', level: 3,
    energy: 72, fullness: 65, happiness: 87,
  };
  vm.runInContext('renderPet(petTeste)', context);
  const card = elements.get('pet-card');
  assert.match(card.innerHTML, /src="image\/Pet\/bolsonaro\.png"/);
  assert.match(card.innerHTML, /alt="Miau"/);
  assert.match(card.innerHTML, /Miau/);
  assert.match(card.innerHTML, /Nível 3/);
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'image', 'Pet', 'bolsonaro.png')), true);
  assert.equal(elements.get('pet-vazio').classList.contains('hidden'), true);
});

test('o perfil só troca o token mágico uma vez e não depende de Chart.js para renderizar', () => {
  const { context } = createContext();
  assert.equal(html.split('fetch(`${API}/auth/token`').length - 1, 1);
  assert.equal(html.includes('checkTokenAutoLogin'), false);
  assert.doesNotThrow(() => vm.runInContext(
    'renderChartXP({}); renderChartAtividade([1, -2, "invalido"]);',
    context
  ));
});

test('exibe o XP dentro do nível atual e calcula a barra corretamente', () => {
  const { context, elements } = createContext();
  context.usuarioTeste = {
    nome: 'Usuário Teste',
    telefone: '+5511999999999',
    xp: 59000,
    level: 112,
    xpInicioNivel: 58417,
    xpParaProximo: 59155,
    xpProgresso: 78,
    gold: 352,
    mensagens: 10,
    quizPoints: 4,
    posicaoRanking: 2,
    xpHistory: {},
    atividadeSemanal: [1, 2, 3, 4, 5, 6, 7],
    grupos: [],
    pet: null,
    casadoCom: null,
  };
  vm.runInContext('preencherPerfil(usuarioTeste)', context);
  assert.equal(elements.get('xp-atual-txt').textContent, '583 / 738 XP neste nível');
  assert.equal(elements.get('xp-prox-txt').textContent, 'Nível 113: 59.2k XP total');
  assert.equal(elements.get('barra-xp').style.width, '78%');
  assert.equal(elements.get('perfil-numero').textContent, '+5511999999999');
  assert.equal(elements.get('act-quiz').textContent, '4');
});


test('processa um link mágico uma única vez e renderiza o perfil autenticado', async () => {
  const chamadas = [];
  const { context, elements } = createContext({
    search: '?token=token-de-teste',
    captureInit: true,
    fetchImpl: async (url, options = {}) => {
      chamadas.push({ url: String(url), method: options.method || 'GET' });
      if (String(url).endsWith('/auth/token')) {
        return { ok: true, status: 200, json: async () => ({ jwt: 'jwt-temporario' }) };
      }
      if (String(url).endsWith('/user/me')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            nome: 'Usuário', telefone: '5511999999999', xp: 0, level: 1,
            xpInicioNivel: 0, xpParaProximo: 80, xpProgresso: 0,
            gold: 0, mensagens: 0, quizPoints: 0, posicaoRanking: 1,
            xpHistory: {}, atividadeSemanal: Array(7).fill(0), grupos: [],
            pet: null, casadoCom: null,
          }),
        };
      }
      throw new Error(`URL inesperada no teste: ${url}`);
    },
  });

  await context.__initPromise;
  assert.deepEqual(chamadas.map(c => c.url.split('/api')[1]), ['/auth/token', '/user/me']);
  assert.equal(chamadas.filter(c => c.url.endsWith('/auth/token')).length, 1);
  assert.equal(context.sessionStorage.getItem('piro_jwt'), 'jwt-temporario');
  assert.equal(context.localStorage.getItem('jwt'), null);
  assert.equal(elements.get('painel').classList.contains('hidden'), false);
  assert.equal(elements.get('perfil-nome').textContent, 'Usuário');
});


test('salva nome de exibição, atualiza o cabeçalho e as iniciais do avatar', async () => {
  const chamadas = [];
  const { context, elements } = createContext({
    fetchImpl: async (url, options = {}) => {
      chamadas.push({ url: String(url), options });
      return {
        ok: true,
        status: 200,
        json: async () => ({ displayName: 'Nome Personalizado' }),
      };
    },
  });
  context.localStorage.setItem('jwt', 'jwt-da-conta');
  context.document.getElementById('display-name-input').value = '  Nome Personalizado  ';
  await elements.get('save-display-name').listeners.get('click')();

  assert.equal(chamadas.length, 1);
  assert.match(chamadas[0].url, /\/user\/display-name$/);
  assert.equal(chamadas[0].options.method, 'PATCH');
  assert.equal(chamadas[0].options.headers.Authorization, 'Bearer jwt-da-conta');
  assert.deepEqual(JSON.parse(chamadas[0].options.body), { displayName: 'Nome Personalizado' });
  assert.equal(elements.get('perfil-nome').textContent, 'Nome Personalizado');
  assert.equal(elements.get('avatar-iniciais').textContent, 'NP');
  assert.equal(context.document.getElementById('display-name-input').value, 'Nome Personalizado');
  assert.equal(elements.get('display-name-msg').textContent, 'Nome atualizado!');
  assert.equal(elements.get('save-display-name').disabled, false);
});

test('não tenta salvar o nome de exibição quando não há sessão', async () => {
  const { context, elements } = createContext();
  context.document.getElementById('display-name-input').value = 'Novo nome';
  await elements.get('save-display-name').listeners.get('click')();
  assert.equal(elements.get('display-name-msg').textContent, 'Sua sessão expirou. Entre novamente.');
});
