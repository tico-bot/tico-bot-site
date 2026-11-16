'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'admin.html'), 'utf8');
const adminCss = fs.readFileSync(path.join(root, 'admin.css'), 'utf8');
const enhancementsCss = fs.readFileSync(path.join(root, 'site-enhancements.css'), 'utf8');

for (const [campo, nome] of [
  ['botAtivo', 'Bot'],
  ['xpAtivo', 'XP'],
  ['antiLink', 'Anti-Link'],
  ['boasVindas', 'Boas-Vindas'],
]) {
  test(`${nome} mantém estado visível e acessível no cartão do grupo`, () => {
    const trecho = html.slice(html.indexOf(`data-campo="${campo}"`) - 650, html.indexOf(`data-campo="${campo}"`) + 360);
    assert.match(trecho, /toggle-wrap/);
    assert.match(trecho, /toggle-status/);
    assert.match(trecho, /aria-pressed=/);
    assert.match(trecho, /data-label=/);
  });
}

test('o Liquid Glass não força altura nem formato circular nos interruptores', () => {
  assert.match(enhancementsCss, /button:not\(\.toggle\)/);
  assert.match(enhancementsCss, /button:not\(\.toggle\)[^\n]*\):active/);
  assert.match(enhancementsCss, /button:not\(\.toggle\)[^\n]*\{ min-height: 44px; \}/);
});

test('os interruptores têm formato horizontal, estados distintos e layout responsivo', () => {
  assert.match(adminCss, /\.toggle\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*25px;[\s\S]*?border-radius:\s*999px !important;/);
  assert.match(adminCss, /\.toggle\.on::after/);
  assert.match(adminCss, /\.toggle-wrap\.is-active \.toggle-status/);
  assert.match(adminCss, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
});

test('o estado textual acompanha a activação e o rollback quando a API falha', () => {
  assert.match(html, /function atualizarVisualToggle\(btn, ativo\)/);
  assert.match(html, /estado\.textContent = ativo \? 'Ligado' : 'Desligado'/);
  assert.match(html, /atualizarVisualToggle\(btn, novoValor\)/);
  assert.match(html, /atualizarVisualToggle\(btn, !novoValor\)/);
});
