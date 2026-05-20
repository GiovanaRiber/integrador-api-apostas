export const API_APOSTAS = 'https://api-aposta-lutas.vercel.app';

let _token: string | null = null;
let _tokenExpiry: number = 0;

const USERNAME = 'integrador_admin';
const PASSWORD = 'integrador_password';

export async function getApostasToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) {
    return _token;
  }

  try {
    let res = await fetch(`${API_APOSTAS}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: USERNAME, senha: PASSWORD })
    });

    if (res.status === 401 || res.status === 404) {
      // User doesn't exist or wrong password, try to register
      await fetch(`${API_APOSTAS}/auth/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: USERNAME, senha: PASSWORD })
      });
      
      // Try login again
      res = await fetch(`${API_APOSTAS}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: USERNAME, senha: PASSWORD })
      });
    }

    if (!res.ok) {
      throw new Error(`Failed to login: ${res.status}`);
    }

    const data = await res.json();
    _token = data.token;
    // Assuming token is valid for 1h (3600000ms), let's refresh 5 mins before
    _tokenExpiry = Date.now() + 55 * 60 * 1000;
    
    return _token!;
  } catch (error) {
    console.error("Error getting apostas token:", error);
    throw error;
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = await getApostasToken();
  const res = await fetch(`${API_APOSTAS}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    let msg = await res.text();
    throw new Error(`API Apostas Error: ${res.status} - ${msg}`);
  }

  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export const ApostasService = {
  listarTodas: async (id_apostador?: string) => {
    const qs = id_apostador ? `?id_apostador=${id_apostador}` : '';
    return request(`/apostas${qs}`);
  },
  criar: async (data: { valor: number, id_luta: number, id_lutador: number, id_apostador: number }) => {
    return request(`/apostas`, { method: 'POST', body: JSON.stringify(data) });
  },
  atualizar: async (id: number | string, data: any) => {
    return request(`/apostas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deletar: async (id: number | string) => {
    return request(`/apostas/${id}`, { method: 'DELETE' });
  }
};
