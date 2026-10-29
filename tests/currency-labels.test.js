'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('ranking and profile display the currency as Prata', () => {
  const ranking = read('index.html');
  const profile = read('perfil.html');

  assert.match(ranking, /data-sort="gold">Prata<\/button>/);
  assert.match(ranking, /class="modal-stat-label">Prata<\/span>/);
  assert.doesNotMatch(ranking, /data-sort="gold">Gold<\/button>/);
  assert.doesNotMatch(ranking, /class="modal-stat-label">Gold<\/span>/);

  assert.match(profile, /class="stat-label">Prata<\/span>/);
  assert.match(profile, /class="grupo-stat-label">Prata<\/span>/);
  assert.doesNotMatch(profile, /class="stat-label">Gold<\/span>/);
  assert.doesNotMatch(profile, /class="grupo-stat-label">Gold<\/span>/);
});

test('casino and racing pages display currency as Prata in balances, results and validation', () => {
  for (const page of ['Jogos/cassino.html', 'Jogos/corrida.html']) {
    const html = read(page);
    assert.match(html, /— Prata<\/strong>/, page);
    assert.match(html, /fmtNum\(saldoAtual\) \+ ' Prata'/, page);
    assert.match(html, /(Aposta mínima: 10 Prata|Mínimo: 10 Prata)/, page);
    assert.match(html, /fmtNum\(saldoFinal\).*Prata/, page);
    assert.doesNotMatch(html, /Aposte seu gold|Aposta mínima: 10 gold|Aposta máxima: 100\.000 gold/, page);
  }
});

test('admin-facing currency labels and confirmations use Prata', () => {
  const admin = read('admin.html');
  const groups = read('Js/admin-grupos.js');
  const users = read('Js/admin-usuarios.js');

  for (const text of ['Ver Prata', 'Saldo total em Prata', 'Ajustar Prata', 'Prata em circulação', 'Maior saldo global em Prata']) {
    assert.ok(admin.includes(text), 'admin.html should contain ' + text);
  }
  for (const source of [admin, groups, users]) {
    assert.doesNotMatch(source, /Zerar Gold|Dar Gold|Remover Gold|Ver Gold|Gold em circulação|Maior Gold Global|gold transferido com sucesso/i);
  }
  assert.match(admin, /zerar TODO o saldo em Prata de \$\{membro\}/i);
  assert.match(admin, /Transferência de \$\{formatNum\(valor\)\} Prata concluída com sucesso/);
});
