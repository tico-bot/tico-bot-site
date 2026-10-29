'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const pages = {
  cassino: path.join(ROOT, 'Jogos', 'cassino.html'),
  corrida: path.join(ROOT, 'Jogos', 'corrida.html'),
};

function readPage(name) {
  return fs.readFileSync(pages[name], 'utf8');
}

function inlineScript(html) {
  const match = html.match(/<script>([\s\S]*?)<\/script>/i);
  assert.ok(match, 'página deve possuir script inline');
  return match[1];
}

function extractFunction(script, functionName) {
  const marker = `function ${functionName}(`;
  const start = script.indexOf(marker);
  assert.notEqual(start, -1, `função ${functionName} deve existir`);
  const bodyStart = script.indexOf('{', start);
  let depth = 0;
  for (let i = bodyStart; i < script.length; i++) {
    if (script[i] === '{') depth++;
    else if (script[i] === '}' && --depth === 0) return script.slice(start, i + 1);
  }
  throw new Error(`função ${functionName} não foi fechada`);
}

test('os scripts inline de Cassino e Corrida têm sintaxe válida', () => {
  for (const [name, file] of Object.entries(pages)) {
    assert.doesNotThrow(() => new Function(inlineScript(readPage(name))), name);
  }
});

test('a tabela de prêmios começa escondida e o botão alterna sua visibilidade', () => {
  const html = readPage('cassino');
  assert.match(html, /<button[\s\S]*?id="btn-toggle-paytable"[\s\S]*?aria-expanded="false"[\s\S]*?>[\s\S]*?Mostrar tabela de prêmios[\s\S]*?<\/button>/);
  assert.match(html, /<div class="paytable-card" id="paytable" style="display:none">/);
  const script = inlineScript(html);
  const fn = extractFunction(script, 'setPaytableVisibility');
  const paytable = { style: { display: 'none' } };
  const button = { textContent: '🏆 Mostrar tabela de prêmios ▼', attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
  const getElement = id => id === 'paytable' ? paytable : id === 'btn-toggle-paytable' ? button : null;
  const setVisibility = new Function('$', `${fn}; return setPaytableVisibility;`)(getElement);

  setVisibility(true);
  assert.equal(paytable.style.display, 'block');
  assert.equal(button.attributes['aria-expanded'], 'true');
  assert.equal(button.textContent, 'Ocultar tabela de prêmios ▲');

  setVisibility(false);
  assert.equal(paytable.style.display, 'none');
  assert.equal(button.attributes['aria-expanded'], 'false');
  assert.equal(button.textContent, '🏆 Mostrar tabela de prêmios ▼');
});

test('a tabela de odds da Corrida começa escondida e pode ser alternada pelo botão', () => {
  const html = readPage('corrida');
  assert.match(html, /<button[\s\S]*?id="btn-toggle-odds"[\s\S]*?aria-expanded="false"[\s\S]*?>[\s\S]*?Mostrar tabela de odds[\s\S]*?<\/button>/);
  assert.match(html, /<div class="odds-card" id="odds-card" style="display:none">/);
  const script = inlineScript(html);
  const fn = extractFunction(script, 'setOddsVisibility');
  const oddsCard = { style: { display: 'none' } };
  const button = { textContent: '📊 Mostrar tabela de odds ▼', attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
  const getElement = id => id === 'odds-card' ? oddsCard : id === 'btn-toggle-odds' ? button : null;
  const setVisibility = new Function('$', `${fn}; return setOddsVisibility;`)(getElement);

  setVisibility(true);
  assert.equal(oddsCard.style.display, 'block');
  assert.equal(button.attributes['aria-expanded'], 'true');
  assert.equal(button.textContent, 'Ocultar tabela de odds ▲');

  setVisibility(false);
  assert.equal(oddsCard.style.display, 'none');
  assert.equal(button.attributes['aria-expanded'], 'false');
  assert.equal(button.textContent, '📊 Mostrar tabela de odds ▼');
  assert.doesNotMatch(script, /\$\('odds-card'\)\.style\.display\s*=\s*show\s*\?\s*'block'\s*:\s*'none'/);
});

test('a folha de estilos global tem nome neutro e todas as referências continuam válidas', () => {
  assert.ok(fs.existsSync(path.join(ROOT, 'site-enhancements.css')));
  assert.equal(fs.existsSync(path.join(ROOT, 'ios-glass.css')), false);
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.html') ? [full] : [];
  });
  for (const file of walk(ROOT)) {
    const html = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /ios-glass\.css/i, `${path.relative(ROOT, file)} should not reference the old filename`);
    for (const match of html.matchAll(/<link\b[^>]*href="([^"]*site-enhancements\.css)"[^>]*>/gi)) {
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), match[1])), `stylesheet path in ${path.relative(ROOT, file)} should exist`);
    }
  }
});

test('os dois jogos aceitam apenas apostas inteiras positivas no parser do navegador', () => {
  for (const name of Object.keys(pages)) {
    const script = inlineScript(readPage(name));
    const fn = extractFunction(script, 'parseApostaInput');
    let currentValue;
    const parseInput = new Function('$', `${fn}; return parseApostaInput;`)(() => ({ get value() { return currentValue; } }));
    for (const [value, expected] of [
      ['10', 10], ['100000', 100000], ['10abc', null], ['10.5', null], ['-10', null], ['', null], ['1e2', null], ['9007199254740992', null],
    ]) {
      currentValue = value;
      assert.equal(parseInput(), expected, `${name}: entrada ${JSON.stringify(value)}`);
    }
  }
});

test('nomes de grupo são escapados antes de entrar no HTML', () => {
  for (const name of Object.keys(pages)) {
    const script = inlineScript(readPage(name));
    const fn = extractFunction(script, 'escapeHtml');
    const escape = new Function(`${fn}; return escapeHtml;`)();
    assert.equal(escape(`Grupo <script>"x" & 'y'</script>`), 'Grupo &lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;');
  }
});

test('odds e probabilidades exibidas na Corrida estão no conjunto esperado', () => {
  const corrida = readPage('corrida');
  const expected = [
    { odds: 3.70, velocidade: 9 }, { odds: 4.16, velocidade: 8 },
    { odds: 4.76, velocidade: 7 }, { odds: 5.55, velocidade: 6 },
    { odds: 6.66, velocidade: 5 }, { odds: 16.65, velocidade: 2 },
  ];
  const uiMatch = corrida.match(/const BICHOS = \[([\s\S]*?)\];/);
  assert.ok(uiMatch, 'a lista de bichos do site deve existir');
  const actual = [...uiMatch[1].matchAll(/odds:\s*([\d.]+),\s*velocidade:\s*(\d+)/g)]
    .map(m => ({ odds: Number(m[1]), velocidade: Number(m[2]) }));
  assert.deepEqual(actual, expected);
  const totalPeso = actual.reduce((sum, bicho) => sum + bicho.velocidade, 0);
  for (const bicho of actual) {
    assert.ok(Math.abs((bicho.velocidade / totalPeso) * bicho.odds - 0.9) < 0.002);
  }
});

test('os atalhos antigos direcionam para as versões dos jogos integradas à API', () => {
  const cassino = fs.readFileSync(path.join(ROOT, 'cassino.html'), 'utf8');
  const corrida = fs.readFileSync(path.join(ROOT, 'corrida.html'), 'utf8');
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.match(cassino, /window\.location\.replace\('Jogos\/cassino\.html'/);
  assert.match(corrida, /window\.location\.replace\('Jogos\/corrida\.html'/);
  assert.match(index, /href="Jogos\/cassino\.html"/);
  assert.match(index, /href="Jogos\/corrida\.html"/);
});


test('uma rodada sem confirmação reutiliza o mesmo ID e bloqueia uma aposta diferente', () => {
  const script = inlineScript(readPage('cassino'));
  const prepareFn = extractFunction(script, 'prepararRequestId');
  const clearFn = extractFunction(script, 'limparRequestId');
  const values = new Map();
  const storage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
  let sequence = 0;
  const fakeCrypto = { randomUUID: () => `test-uuid-${++sequence}` };
  const helpers = new Function('sessionStorage', 'globalThis', 'crypto', `${prepareFn}; ${clearFn}; return { prepararRequestId, limparRequestId };`)(storage, { crypto: fakeCrypto }, fakeCrypto);
  const payload = { idGrupo: 'grupo@g.us', aposta: 10 };
  const first = helpers.prepararRequestId('slots', payload);
  assert.equal(first, 'test-uuid-1');
  assert.equal(helpers.prepararRequestId('slots', payload), first);
  assert.equal(helpers.prepararRequestId('slots', { idGrupo: 'grupo@g.us', aposta: 20 }), null);
  helpers.limparRequestId('slots', first);
  assert.equal(helpers.prepararRequestId('slots', { idGrupo: 'grupo@g.us', aposta: 20 }), 'test-uuid-2');

  const failingStorage = {
    getItem() { return null; },
    setItem() { throw new Error('storage disabled'); },
    removeItem() {},
  };
  const safeHelpers = new Function('sessionStorage', 'globalThis', 'crypto', `${prepareFn}; return prepararRequestId;`)(failingStorage, { crypto: fakeCrypto }, fakeCrypto);
  assert.equal(safeHelpers('slots', payload), null, 'sem persistência do ID não deve enviar uma aposta insegura');
});
