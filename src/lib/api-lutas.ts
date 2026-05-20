export const API_LUTAS = 'https://bet3m-production.up.railway.app';
const API_KEY = 'bet3M-UENP';

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_LUTAS}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    let msg = await res.text();
    throw new Error(`API Lutas Error: ${res.status} - ${msg}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export const LutasService = {
  listarTodas: async () => request(`/lutas`),
  buscarPorId: async (id: number | string) => request(`/lutas/${id}`),
  criar: async (data: { horario: string, data: string, lutador1: number, lutador2: number }) => request(`/lutas`, { method: 'POST', body: JSON.stringify(data) }),
  atualizar: async (id: number | string, data: any) => request(`/lutas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: async (id: number | string) => request(`/lutas/${id}`, { method: 'DELETE' })
};
