import fs from 'node:fs';
import crypto from 'node:crypto';

const API_KEY = 'bet3M-UENP';
const API_NAME = 'bet3M';
const API_BET3M = 'https://bet3m-production.up.railway.app/lutas';
const API_FOQUINHO = 'https://betting-api-lutas.vercel.app/lutas';
const BASE_ROUTE = '/lutas';

function carregarChavePrivada() {
  if (process.env.PRIVATE_KEY_PEM) {
    return process.env.PRIVATE_KEY_PEM.replace(/\\n/g, '\n');
  }

  if (fs.existsSync('private_key.pem')) {
    return fs.readFileSync('private_key.pem', 'utf8');
  }

  throw new Error('Chave privada RSA não configurada. Defina PRIVATE_KEY_PEM ou crie private_key.pem.');
}

function gerarAssinatura(rota) {
  const privateKey = carregarChavePrivada();
  const mensagem = `${API_NAME}:${rota}`;

  const assinatura = crypto.sign('sha256', Buffer.from(mensagem), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN,
  });

  return assinatura.toString('base64');
}

function headersRSA(rota) {
  return {
    'x-api-nome': API_NAME,
    'x-assinatura': gerarAssinatura(rota),
  };
}

async function parseResponse(res) {
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API Lutas Error: ${res.status} - ${msg}`);
  }

  return parseResponse(res);
}

function convertToStandard(json) {
  if (Array.isArray(json)) {
    if (json.length === 0 || 'lutador1' in json[0]) return json;

    return json.map((elem) => ({
      ...elem,
      lutador1: elem.id_lutador1,
      lutador2: elem.id_lutador2,
    }));
  }

  if (!json || typeof json !== 'object') return json;
  if ('lutador1' in json) return json;

  return {
    ...json,
    lutador1: json.id_lutador1,
    lutador2: json.id_lutador2,
  };
}

function getLutasObj(json) {
  const base = {
    horario: json.horario,
    data: json.data,
  };

  if ('id_lutador1' in json) {
    return [
      {
        ...base,
        lutador1: json.id_lutador1,
        lutador2: json.id_lutador2,
      },
      {
        ...base,
        id_lutador1: json.id_lutador1,
        id_lutador2: json.id_lutador2,
      },
    ];
  }

  const bet3mJson = {
    ...base,
    lutador1: json.lutador1,
    lutador2: json.lutador2,
  };

  const foguinhoJson = {
    ...base,
    id_lutador1: json.lutador1,
    id_lutador2: json.lutador2,
  };

  return [bet3mJson, foguinhoJson];
}

async function fetchFromAny(path, signatureRoute, init = {}) {
  const firstBet3M = Math.random() > 0.5;
  const attempts = firstBet3M
    ? [
        () => requestJson(`${API_BET3M}${path}`, {
          ...init,
          headers: {
            'X-API-KEY': API_KEY,
            ...(init.headers || {}),
          },
        }),
        () => requestJson(`${API_FOQUINHO}${path}`, {
          ...init,
          headers: {
            ...headersRSA(signatureRoute),
            ...(init.headers || {}),
          },
        }),
      ]
    : [
        () => requestJson(`${API_FOQUINHO}${path}`, {
          ...init,
          headers: {
            ...headersRSA(signatureRoute),
            ...(init.headers || {}),
          },
        }),
        () => requestJson(`${API_BET3M}${path}`, {
          ...init,
          headers: {
            'X-API-KEY': API_KEY,
            ...(init.headers || {}),
          },
        }),
      ];

  let lastError = null;

  for (const attempt of attempts) {
    try {
      return convertToStandard(await attempt());
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Falha ao buscar lutas');
}

async function writeToBoth(method, path, body) {
  const [bet3mJson, foguinhoJson] = getLutasObj(body);

  const [res1, res2] = await Promise.allSettled([
    fetch(`${API_BET3M}${path}`, {
      method,
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bet3mJson),
    }),
    fetch(`${API_FOQUINHO}${path}`, {
      method,
      headers: {
        ...headersRSA(path),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foguinhoJson),
    }),
  ]);

  const status1 = res1.status === 'fulfilled' ? res1.value.status : null;
  const status2 = res2.status === 'fulfilled' ? res2.value.status : null;
  const ok1 = status1 >= 200 && status1 < 300;
  const ok2 = status2 >= 200 && status2 < 300;

  return {
    status1,
    status2,
    ok1,
    ok2,
    data: body,
  };
}

export const LutasService = {
  listarTodas: async () => fetchFromAny('', BASE_ROUTE),
  buscarPorId: async (id) => fetchFromAny(`/${id}`, `${BASE_ROUTE}/${id}`),
  criar: async (data) => {
    const result = await writeToBoth('POST', BASE_ROUTE, data);

    if (!result.ok1 && !result.ok2) {
      throw new Error('Falha em ambas as APIs');
    }

    return {
      msg: 'Processado',
      data,
      apis: [
        { api: 0, status: result.status1, ok: result.ok1 },
        { api: 1, status: result.status2, ok: result.ok2 },
      ],
    };
  },
  atualizar: async (id, data) => {
    const result = await writeToBoth('PUT', `/${id}`, data);

    if (!result.ok1 && !result.ok2) {
      throw new Error('Não encontrado em nenhuma API');
    }

    return {
      msg: 'Processado',
      data,
      apis: [
        { api: 0, status: result.status1, ok: result.ok1 },
        { api: 1, status: result.status2, ok: result.ok2 },
      ],
    };
  },
  deletar: async (id) => {
    const [res1, res2] = await Promise.allSettled([
      fetch(`${API_BET3M}/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${API_FOQUINHO}/${id}`, {
        method: 'DELETE',
        headers: headersRSA(`${BASE_ROUTE}/${id}`),
      }),
    ]);

    const status1 = res1.status === 'fulfilled' ? res1.value.status : null;
    const status2 = res2.status === 'fulfilled' ? res2.value.status : null;
    const ok1 = status1 >= 200 && status1 < 300;
    const ok2 = status2 >= 200 && status2 < 300;

    if (!ok1 && !ok2) {
      throw new Error('Não encontrado em nenhuma API');
    }

    return {
      msg: 'Processado',
      apis: [
        { api: 0, status: status1, ok: ok1 },
        { api: 1, status: status2, ok: ok2 },
      ],
    };
  },
};
