import { fetchAPI } from './api';

export const LutadoresService = {
  listarTodos: async () => fetchAPI(`/lutadores`),
  buscarPorId: async (id) => fetchAPI(`/lutadores/${id}`),
  criar: async (data) => fetchAPI(`/lutadores`, { method: 'POST', body: JSON.stringify(data) }),
  atualizar: async (id, data) => fetchAPI(`/lutadores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: async (id) => fetchAPI(`/lutadores/${id}`, { method: 'DELETE' })
};
