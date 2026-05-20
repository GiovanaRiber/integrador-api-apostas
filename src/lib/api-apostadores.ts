export const API_APOSTADORES = 'https://api-sd-df8o.onrender.com';

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_APOSTADORES}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    let msg = await res.text();
    throw new Error(`API Apostadores Error: ${res.status} - ${msg}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export const ApostadoresService = {
  listarTodos: async () => request(`/apostadores/`),
  criar: async (data: { nome: string, idade: number, chave_pix: string }) => request(`/apostadores/`, { method: 'POST', body: JSON.stringify(data) }),
  atualizar: async (id: number | string, data: any) => request(`/apostadores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: async (id: number | string) => request(`/apostadores/${id}`, { method: 'DELETE' })
};
