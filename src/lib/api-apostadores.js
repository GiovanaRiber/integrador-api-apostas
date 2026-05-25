import { fetchAPI } from './api';

export const ApostadoresService = {
  listarTodos: async () => fetchAPI(`/apostadores`),
  criar: async (data) => fetchAPI(`/apostadores`, { method: 'POST', body: JSON.stringify(data) }),
  atualizar: async (id, data) => fetchAPI(`/apostadores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: async (id) => fetchAPI(`/apostadores/${id}`, { method: 'DELETE' })
};
