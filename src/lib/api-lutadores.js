const API_LUTADORES = 'https://lutadores-api-22f61a69f511.herokuapp.com';

let _privateKey = null;
let _isInitialized = false;

export async function initLutadoresAPI() {
  if (_isInitialized) return;

  // Busca chave pública do servidor
  const res = await fetch(`${API_LUTADORES}/chave-publica`);
  if (!res.ok) throw new Error(`Falha ao buscar chave pública: ${res.status}`);

  const data = await res.json();
  const spkiB64 = data.publicKey;
  const spkiBytes = Uint8Array.from(atob(spkiB64), (c) => c.charCodeAt(0));

  await crypto.subtle.importKey(
    'spki',
    spkiBytes,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );

  // Gera par de chaves do cliente
  const kp = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt']
  );
  _privateKey = kp.privateKey;

  // Envia chave pública ao servidor (handshake)
  const spki = await crypto.subtle.exportKey('spki', kp.publicKey);
  const pubB64 = btoa(String.fromCharCode(...new Uint8Array(spki)));

  const handshakeRes = await fetch(`${API_LUTADORES}/handshake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey: pubB64 }),
  });

  if (!handshakeRes.ok) throw new Error(`Falha no handshake RSA: ${handshakeRes.status}`);

  _isInitialized = true;
  console.log('[Lutadores] Handshake RSA concluído com sucesso.');
}

async function decryptResponse(res) {
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API Lutadores Error: ${res.status} - ${msg}`);
  }

  if (res.headers.get('X-Content-Encrypted') !== 'true') {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  if (!_privateKey) throw new Error('Chave privada não inicializada — handshake não foi concluído.');

  const chunks = JSON.parse(await res.text());
  const bytes = [];

  for (const chunk of chunks) {
    const cb = Uint8Array.from(atob(chunk), (c) => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, _privateKey, cb);
    bytes.push(...new Uint8Array(plain));
  }
  
  let rawString = new TextDecoder().decode(new Uint8Array(bytes));
  
  // WORKAROUND: A API de Lutadores está retornando JSON inválido com aspas duplas (ex: ""Sócrates"").
  // Isso quebra o JSON.parse. Vamos limpar as aspas duplas desnecessárias antes de parsear.
  rawString = rawString.replace(/: ""/g, ': "').replace(/""([,}])/g, '"$1');

  try {
    return JSON.parse(rawString);
  } catch (err) {
    console.error('[Lutadores] Erro ao parsear JSON descriptografado:', err.message);
    console.error('[Lutadores] String recebida:', rawString);
    throw new Error(`Erro ao parsear dados criptografados: ${err.message}. Dados corrompidos na API externa.`);
  }
}

async function withInit(fn) {
  // Se não inicializado, tenta inicializar (propaga erro se falhar)
  if (!_isInitialized) {
    await initLutadoresAPI();
  }
  try {
    return await fn();
  } catch (err) {
    // Se der erro de chave, reseta para forçar novo handshake na próxima chamada
    if (err.message.includes('handshake') || err.message.includes('chave')) {
      _isInitialized = false;
      _privateKey = null;
    }
    throw err;
  }
}

export const LutadoresService = {
  listarTodos: () => withInit(async () => {
    const res = await fetch(`${API_LUTADORES}/lutadores`);
    return decryptResponse(res);
  }),
  buscarPorId: (id) => withInit(async () => {
    const res = await fetch(`${API_LUTADORES}/lutadores/${id}`);
    return decryptResponse(res);
  }),
  criar: ({ nome, apelido, categoria, arte }) => withInit(async () => {
    const qs = new URLSearchParams({ nome, apelido, categoria, arte });
    const res = await fetch(`${API_LUTADORES}/lutadores?${qs.toString()}`, { method: 'POST' });
    return decryptResponse(res);
  }),
  atualizar: (id, campos) => withInit(async () => {
    const qs = new URLSearchParams(campos);
    const res = await fetch(`${API_LUTADORES}/lutadores/${id}?${qs.toString()}`, { method: 'PUT' });
    return decryptResponse(res);
  }),
  deletar: (id) => withInit(async () => {
    const res = await fetch(`${API_LUTADORES}/lutadores/${id}`, { method: 'DELETE' });
    return decryptResponse(res);
  }),
};
