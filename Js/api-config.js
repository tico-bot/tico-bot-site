/* Configuração compartilhada da API do Tico Bot.
 * Links mágicos do perfil podem apontar para a API HTTPS temporária do bot local.
 * O endereço só é persistido na sessão depois de o token e o perfil serem validados.
 */
(() => {
  'use strict';

  const API_PRODUCAO = 'https://tico-bot-6jpn.onrender.com/api';
  const API_LOCAL = 'http://localhost:3000/api';
  const CHAVE_API = 'tico_api_base';

  function validarApiTemporaria(valor) {
    if (typeof valor !== 'string' || !valor.trim()) return null;
    try {
      const url = new URL(valor.trim());
      if (url.protocol !== 'https:'
          || !/^[a-z0-9-]+\.trycloudflare\.com$/i.test(url.hostname)
          || url.username || url.password || url.search || url.hash
          || url.pathname.replace(/\/+$/, '') !== '/api') {
        return null;
      }
      return `${url.origin}/api`;
    } catch {
      return null;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const estaNoLinkMagicoDoPerfil = /(?:^|\/)perfil\.html$/i.test(window.location.pathname)
    && params.has('token');
  const apiRecebida = estaNoLinkMagicoDoPerfil
    ? validarApiTemporaria(params.get('api'))
    : null;

  let apiSalva = null;
  try {
    apiSalva = validarApiTemporaria(sessionStorage.getItem(CHAVE_API));
    if (!apiSalva) sessionStorage.removeItem(CHAVE_API);
  } catch {}

  const hostname = window.location.hostname;
  const estaNoLocal = hostname === 'localhost' || hostname === '127.0.0.1'
    || hostname === '::1';

  window.TICO_API_BASE = apiRecebida || apiSalva || (estaNoLocal ? API_LOCAL : API_PRODUCAO);
  window.confirmarApiLocalTico = () => {
    if (!estaNoLinkMagicoDoPerfil || !apiRecebida) return false;
    try {
      sessionStorage.setItem(CHAVE_API, apiRecebida);
      return true;
    } catch {
      return false;
    }
  };
  window.limparApiLocalTico = () => {
    try { sessionStorage.removeItem(CHAVE_API); } catch {}
    window.TICO_API_BASE = estaNoLocal ? API_LOCAL : API_PRODUCAO;
  };
})();
