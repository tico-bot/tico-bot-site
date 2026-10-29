'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const BOT = path.resolve(ROOT, '..', 'Tico-Bot');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const readBot = file => fs.readFileSync(path.join(BOT, file), 'utf8');

test('cadastro envia OTP privado e o código é obrigatório no pedido de cadastro', () => {
  const page = read('cadastro.html');
  assert.match(page, /id="btnEnviarCodigo"/);
  assert.match(page, /id="codigo"[^>]*pattern="\[0-9\]\{6\}"/);
  assert.match(page, /fetch\(`\$\{API\}\/auth\/otp\/enviar`/);
  assert.match(page, /fetch\(`\$\{API\}\/auth\/cadastrar`/);
  assert.match(page, /codigo,/);
  assert.match(page, /password.length < 10/);
  assert.match(page, /maxlength="72"/);
});

test('login envia identifier como esperado pela API e não deixa JWT persistente', () => {
  const page = read('login.html');
  assert.match(page, /JSON\.stringify\(\{ identifier, password \}\)/);
  assert.match(page, /sessionStorage\.setItem\('piro_jwt', data\.jwt\)/);
  assert.match(page, /localStorage\.removeItem\('jwt'\)/);
  assert.doesNotMatch(page, /localStorage\.setItem\('jwt'/);
  const api = readBot('src/routes/api.js');
  assert.match(api, /const \{ identifier, username, password \} = req\.body \|\| \{\}/);
  assert.match(api, /rateLimitLogin/);
  assert.match(api, /DUMMY_PASSWORD_HASH/);
});

test('perfil permite controlar privacidade do telefone e mostra bio vinda do bot', () => {
  const page = read('perfil.html');
  assert.match(page, /id="mostrar-telefone-publico"/);
  assert.match(page, /PATCH`?,?\s*\$\{API\}\/user\/privacy|\$\{API\}\/user\/privacy/);
  assert.match(page, /mostrarTelefonePublico: checkbox\.checked/);
  assert.match(page, /u\.mostrarTelefonePublico !== false/);
  assert.match(page, /u\.bio/);
  const api = readBot('src/routes/api.js');
  assert.match(api, /router\.patch\('\/user\/privacy', auth/);
  assert.match(api, /mostrarTelefonePublico: usuario\.mostrarTelefonePublico !== false/);
  assert.match(api, /bio:\s+usuario\.bio/);
});

test('ranking apresenta telefone apenas quando habilitado e renderiza bio como texto escapado', () => {
  const page = read('index.html');
  const api = readBot('src/routes/api.js');
  assert.match(api, /telefone:\s+publico\.telefone/);
  assert.match(api, /telefoneOculto:\s+publico\.telefoneOculto/);
  assert.match(api, /bio:\s+publico\.bio/);
  assert.match(page, /escapeHtml\(u\.bio\)/);
  assert.match(page, /modal-bio/);
  assert.match(page, /user\.telefoneOculto \? '📱 Telefone ocultado pelo usuário'/);
  assert.doesNotMatch(api.match(/router\.get\('\/user\/ranking',([\s\S]*?)\/\/ GET \/api\/user\/ranking\/grupo/)[1], /idWhatsApp:\s+a\._id/);
});

test('login de admin usa sessão JWT curta; lista de contas pede token adicional vinculado à sessão', () => {
  const page = read('admin.html');
  const api = readBot('src/routes/api.js');
  assert.match(page, /fetch\(`\$\{API\}\/admin\/login`/);
  assert.match(page, /sessionStorage\.setItem\('piro_admin_token', data\.token\)/);
  assert.doesNotMatch(page, /sessionStorage\.setItem\('piro_admin_key'/);
  assert.match(page, /x-contas-key/);
  assert.match(page, /x-contas-token/);
  assert.match(api, /router\.post\('\/admin\/login'/);
  assert.match(api, /expiresIn: '1h'/);
  assert.match(api, /router\.get\('\/admin\/contas', adminAuth, contasAuth/);
  assert.match(api, /adminSessionId !== req\.admin\?\.sessionId/);
});

test('recuperação usa OTP privado e política de senha alinhada ao backend', () => {
  const page = read('recuperar.html');
  const api = readBot('src/routes/api.js');
  assert.match(page, /conversa privada do WhatsApp/);
  assert.match(page, /novaSenha.length < 10 \|\| novaSenha.length > 128/);
  assert.match(api, /novaSenha.length < 10 \|\| novaSenha.length > 128/);
  const router = readBot('src/router.js');
  const recovery = router.slice(router.indexOf("matchCmd(cmdWord, 'recuperar')"), router.indexOf("if (matchCmd(cmdWord, 'resetsenha'))"));
  assert.match(recovery, /sendMessage\(pnJid/);
  assert.doesNotMatch(recovery, /text:\s*`[^`]*\$\{codigo\}[^`]*`\s*\},\s*\{ quoted: msg \}/);
});
