export const API_APOSTADORES = 'https://api-sd-df8o.onrender.com';

async function request(endpoint, options = {}) {
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
  criar: async (data) => request(`/apostadores/`, { method: 'POST', body: JSON.stringify(data) }),
  atualizar: async (id, data) => request(`/apostadores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: async (id) => request(`/apostadores/${id}`, { method: 'DELETE' })
};
