import { NextResponse } from 'next/server';
import { loginApostas, isApostasAutenticado } from '@/lib/api-apostas';

/** GET /api/auth/apostas — verifica se já está autenticado */
export async function GET() {
  return NextResponse.json({ autenticado: isApostasAutenticado() });
}

/** POST /api/auth/apostas — faz login na API Apostas */
export async function POST(request) {
  try {
    const { usuario, senha } = await request.json();
    if (!usuario || !senha) {
      return NextResponse.json(
        { error: 'Campos "usuario" e "senha" são obrigatórios.' },
        { status: 400 }
      );
    }
    await loginApostas(usuario, senha);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
