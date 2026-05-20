export const API_APOSTAS = 'https://api-aposta-lutas.vercel.app';

let _token = null;
let _tokenExpiry = 0;

/**
 * Define as credenciais e realiza o login na API de apostas.
 * Chamado pela rota /api/auth/apostas quando o usuário faz login.
 */
export async function loginApostas(usuario, senha) {
  // Tenta login direto
  let res = await fetch(`${API_APOSTAS}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  // Se usuário não existe, registra e tenta logar novamente
  if (res.status === 401 || res.status === 404) {
    const regRes = await fetch(`${API_APOSTAS}/auth/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });
    if (!regRes.ok && regRes.status !== 409) {
      // 409 = usuário já existe, tudo bem
      throw new Error(`Erro ao registrar: ${regRes.status}`);
    }

    res = await fetch(`${API_APOSTAS}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Credenciais inválidas: ${res.status} - ${msg}`);
  }

  const data = await res.json();
  _token = data.token;
  // Token válido por 1h; renova 5 min antes
  _tokenExpiry = Date.now() + 55 * 60 * 1000;

  return _token;
}

/**
 * Retorna true se há um token válido em memória.
 */
export function isApostasAutenticado() {
  return !!_token && Date.now() < _tokenExpiry;
}

/**
 * Obtém o token atual (lança erro se não autenticado).
 */
export function getApostasToken() {
  if (!_token || Date.now() >= _tokenExpiry) {
    throw new Error('Não autenticado. Faça login primeiro.');
  }
  return _token;
}

async function request(endpoint, options = {}) {
  const token = getApostasToken();
  const res = await fetch(`${API_APOSTAS}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API Apostas Error: ${res.status} - ${msg}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export const ApostasService = {
  listarTodas: async (id_apostador) => {
    const qs = id_apostador ? `?id_apostador=${id_apostador}` : '';
    return request(`/apostas${qs}`);
  },
  criar: async (data) => {
    return request(`/apostas`, { method: 'POST', body: JSON.stringify(data) });
  },
  atualizar: async (id, data) => {
    return request(`/apostas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deletar: async (id) => {
    return request(`/apostas/${id}`, { method: 'DELETE' });
  }
};
