import { NextResponse } from 'next/server';

const API_LUTADORES = 'https://lutadores-api-22f61a69f511.herokuapp.com';

let _privateKey: CryptoKey | null = null;
let _servidorPublicKey: CryptoKey | null = null;
let _isInitialized = false;

export async function initLutadoresAPI() {
  if (_isInitialized) return;

  try {
    const res = await fetch(`${API_LUTADORES}/chave-publica`);
    if (!res.ok) throw new Error(`Failed to fetch public key: ${res.status}`);
    const data = await res.json();
    const spkiB64 = data.publicKey;
    const spkiBytes = Uint8Array.from(atob(spkiB64), (c) => c.charCodeAt(0));

    _servidorPublicKey = await crypto.subtle.importKey(
      'spki',
      spkiBytes,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const kp = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['encrypt', 'decrypt']
    );
    _privateKey = kp.privateKey;

    const spki = await crypto.subtle.exportKey('spki', kp.publicKey);
    const pubB64 = btoa(String.fromCharCode(...new Uint8Array(spki)));

    const handshakeRes = await fetch(`${API_LUTADORES}/handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicKey: pubB64 }),
    });

    if (!handshakeRes.ok) throw new Error(`Failed handshake: ${handshakeRes.status}`);
    _isInitialized = true;
  } catch (error) {
    console.error("Error initializing Lutadores API:", error);
  }
}

async function decryptResponse(res: Response) {
  if (res.headers.get('X-Content-Encrypted') !== 'true') {
    const text = await res.text();
    try {
       return JSON.parse(text);
    } catch {
       return text;
    }
  }

  const chunks = JSON.parse(await res.text());
  const bytes: number[] = [];
  
  if (!_privateKey) throw new Error("Private key not initialized");

  for (const chunk of chunks) {
    const cb = Uint8Array.from(atob(chunk), (c) => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, _privateKey, cb);
    bytes.push(...new Uint8Array(plain));
  }
  return JSON.parse(new TextDecoder().decode(new Uint8Array(bytes)));
}

export const LutadoresService = {
  listarTodos: async () => {
    await initLutadoresAPI();
    const res = await fetch(`${API_LUTADORES}/lutadores`);
    return decryptResponse(res);
  },
  buscarPorId: async (id: number | string) => {
    await initLutadoresAPI();
    const res = await fetch(`${API_LUTADORES}/lutadores/${id}`);
    return decryptResponse(res);
  },
  criar: async ({ nome, apelido, categoria, arte }: { nome: string, apelido: string, categoria: string, arte: string }) => {
    await initLutadoresAPI();
    const qs = new URLSearchParams({ nome, apelido, categoria, arte });
    const res = await fetch(`${API_LUTADORES}/lutadores?${qs.toString()}`, { method: 'POST' });
    return decryptResponse(res);
  },
  atualizar: async (id: number | string, campos: Record<string, string>) => {
    await initLutadoresAPI();
    const qs = new URLSearchParams(campos);
    const res = await fetch(`${API_LUTADORES}/lutadores/${id}?${qs.toString()}`, { method: 'PUT' });
    return decryptResponse(res);
  },
  deletar: async (id: number | string) => {
    await initLutadoresAPI();
    const res = await fetch(`${API_LUTADORES}/lutadores/${id}`, { method: 'DELETE' });
    return decryptResponse(res);
  }
};
