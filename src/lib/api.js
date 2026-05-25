export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let _token = null;

export function setToken(token) {
  _token = token;
}

export function getToken() {
  return _token;
}

export function isAutenticado() {
  return !!_token;
}

export async function login(usuario, senha) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Falha no login: ${res.status}`);
  }

  const data = await res.json();
  if (data.token) {
    setToken(data.token);
    return data.token;
  } else {
    throw new Error('Token não recebido');
  }
}

export async function fetchAPI(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    let message = `API Error: ${res.status}`;
    try {
      const errData = await res.json();
      message = errData.message || errData.error || message;
    } catch {
      message = await res.text() || message;
    }
    throw new Error(message);
  }

  // Verifica se o corpo está vazio
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
