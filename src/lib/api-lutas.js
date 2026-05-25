import { fetchAPI } from './api';

export const LutasService = {
  listarTodas: async () => fetchAPI(`/lutas`),
  buscarPorId: async (id) => fetchAPI(`/lutas/${id}`),
  criar: async (data) => fetchAPI(`/lutas`, { method: 'POST', body: JSON.stringify(data) }),
  atualizar: async (id, data) => fetchAPI(`/lutas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: async (id) => fetchAPI(`/lutas/${id}`, { method: 'DELETE' })
};
