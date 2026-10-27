/* =========================================================
   admin-economia.js — Tico Bot Admin
   Economia global e Logs em tempo real
   ========================================================= */
(function() {
'use strict';

const _ce  = () => window.adminCore;
const API          = () => _ce().API;
const $            = id   => _ce().$(id);
const show         = id   => _ce().show(id);
const hide         = id   => _ce().hide(id);
const escapeHtml   = s    => _ce().escapeHtml(s);
const adminHeaders = ()   => _ce().adminHeaders();
const toast        = (m,t)=> _ce().toast(m,t);
const formatNum    = n    => _ce().formatNum(n);
const nomeGrupoPorJid = jid => _ce().nomeGrupoPorJid(jid);

/* ═══════════════════════════════════════════════════════════
   ECONOMIA
═══════════════════════════════════════════════════════════ */
let economiaCarregada = false;

window.carregarEconomia = async function() {
  if (economiaCarregada) return;
  hide('economia-conteudo');
  show('economia-loading');

  try {
    const res = await fetch(`${API()}/admin/economia`, { headers: adminHeaders() });
    if (!res.ok) throw new Error();
    const data = await res.json();

    $('eco-total-gold').textContent     = formatNum(data.totalGold);
    $('eco-total-xp').textContent       = formatNum(data.totalXp);
    $('eco-media-gold').textContent     = formatNum(data.mediaGold);
    $('eco-total-usuarios').textContent = formatNum(data.totalUsuariosComGold);

    renderEcoRank($('eco-rank-gold'),  data.topGold,  'gold', m => `🪙 ${formatNum(m.gold)}`);
    renderEcoRank($('eco-rank-xp'),   data.topXp,    'xp',   m => `⚡ ${formatNum(m.xp)} XP`);
    renderEcoRank($('eco-rank-msgs'),  data.topMsgs,  'msg',  m => `💬 ${formatNum(m.mensagens)}`);

    hide('economia-loading');
    show('economia-conteudo');
    economiaCarregada = true;
  } catch (err) {
    console.error('[Admin] Erro ao carregar economia:', err);
    economiaCarregada = false; // ← permite tentar novamente
    const el = $('economia-loading');
    if (el) {
      el.innerHTML = '<div class="estado-erro">Erro ao carregar economia. <button class="link-btn" onclick="window.carregarEconomia()">Tentar novamente</button></div>';
      el.classList.remove('estado-loading');
    }
    show('economia-loading');
  }
};

function renderEcoRank(container, lista, tipo, valorFn) {
  if (!container) return;
  if (!lista?.length) { container.innerHTML = '<div class="dash-vazio">Sem dados.</div>'; return; }
  container.innerHTML = lista.map((m, i) => {
    const posClass = i === 0 ? 'p1' : i === 1 ? 'p2' : i === 2 ? 'p3' : '';
    return `
    <div class="eco-rank-item">
      <span class="eco-rank-pos ${posClass}">${i+1}</span>
      <div style="flex:1;overflow:hidden;">
        <div class="eco-rank-nome">${escapeHtml(m.nome || m.idWhatsApp?.split('@')[0] || '—')}</div>
        ${m.nomeGrupo ? `<div class="eco-rank-grupo">${escapeHtml(m.nomeGrupo)}</div>` : ''}
      </div>
      <span class="eco-rank-val ${tipo}">${valorFn(m)}</span>
    </div>`;
  }).join('');
}

$('btn-refresh-economia')?.addEventListener('click', () => {
  economiaCarregada = false;
  window.carregarEconomia();
});

/* ═══════════════════════════════════════════════════════════
   LOGS
═══════════════════════════════════════════════════════════ */
let logsCache      = [];
let logsPagina     = 1;
const LOGS_POR_PAG = 50;
window.logsLiveTimer = null;

window.carregarLogs = async function(pagina = 1) {
  logsPagina = pagina;
  hide('logs-lista');
  hide('logs-vazio');
  hide('logs-erro');
  hide('logs-paginacao');
  show('logs-loading');

  const tipo  = $('logs-tipo-filtro')?.value || '';
  const busca = $('logs-busca')?.value.trim() || '';
  const qs    = new URLSearchParams({ pagina, limite: LOGS_POR_PAG });
  if (tipo)  qs.set('tipo',  tipo);
  if (busca) qs.set('busca', busca);

  try {
    const res = await fetch(`${API()}/admin/logs?${qs}`, { headers: adminHeaders() });
    if (!res.ok) throw new Error();
    const { logs, total } = await res.json();
    logsCache = logs || [];
    renderLogs(logsCache, total, pagina);
  } catch {
    hide('logs-loading');
    show('logs-erro');
  }
};

function renderLogs(logs, total = 0, pagina = 1) {
  hide('logs-loading');
  const badge = $('logs-contagem');
  if (badge) badge.textContent = total ? `(${total})` : '';

  if (!logs.length) { show('logs-vazio'); return; }

  const lista = $('logs-lista');
  lista.innerHTML = logs.map(l => {
    const tipoClass = `tipo-${l.tipo || 'info'}`;
    const hora = l.timestamp
      ? new Date(l.timestamp).toLocaleString('pt-BR', {
          day:'2-digit', month:'2-digit',
          hour:'2-digit', minute:'2-digit', second:'2-digit'
        })
      : '—';
    return `
    <div class="log-item ${tipoClass}">
      <span class="log-hora">${hora}</span>
      <div class="log-corpo">
        <span class="log-cmd">${escapeHtml(l.comando || l.mensagem || '—')}</span>
        ${l.detalhe ? `<span class="log-detalhe">${escapeHtml(l.detalhe)}</span>` : ''}
        <div class="log-meta">
          ${l.tipo    ? `<span class="log-badge ${l.tipo}">${l.tipo.toUpperCase()}</span>` : ''}
          ${l.usuario ? `<span class="log-badge">👤 ${escapeHtml(l.usuario)}</span>` : ''}
          ${l.grupo   ? `<span class="log-badge">👥 ${escapeHtml(nomeGrupoPorJid(l.grupo) || l.grupo)}</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  show('logs-lista');

  const totalPags = Math.ceil(total / LOGS_POR_PAG);
  if (totalPags > 1) {
    $('logs-pagina-info').textContent = `Pág ${pagina} / ${totalPags}`;
    $('logs-prev').disabled = pagina <= 1;
    $('logs-next').disabled = pagina >= totalPags;
    show('logs-paginacao');
  }
}

$('btn-refresh-logs')?.addEventListener('click',  () => window.carregarLogs(1));
$('btn-retry-logs')?.addEventListener('click',    () => window.carregarLogs(1));
$('logs-tipo-filtro')?.addEventListener('change', () => window.carregarLogs(1));

let logsBuscaTimer;
$('logs-busca')?.addEventListener('input', () => {
  clearTimeout(logsBuscaTimer);
  logsBuscaTimer = setTimeout(() => window.carregarLogs(1), 400);
});

$('logs-prev')?.addEventListener('click', () => window.carregarLogs(logsPagina - 1));
$('logs-next')?.addEventListener('click', () => window.carregarLogs(logsPagina + 1));

$('chk-logs-live')?.addEventListener('change', e => {
  if (window.logsLiveTimer) clearInterval(window.logsLiveTimer);
  window.logsLiveTimer = e.target.checked
    ? setInterval(() => window.carregarLogs(1), 10000)
    : null;
});

})(); // fim IIFE admin-economia.js