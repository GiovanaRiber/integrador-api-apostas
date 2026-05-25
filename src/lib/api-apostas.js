import { fetchAPI } from './api';

export const ApostasService = {
  listarTodas: async (id_apostador) => {
    const qs = id_apostador ? `?id_apostador=${id_apostador}` : '';
    return fetchAPI(`/apostas${qs}`);
  },
  criar: async (data) => fetchAPI(`/apostas`, { method: 'POST', body: JSON.stringify(data) }),
  atualizar: async (id, data) => fetchAPI(`/apostas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: async (id) => fetchAPI(`/apostas/${id}`, { method: 'DELETE' })
};
