import { NextResponse } from 'next/server';
import { ApostasService } from '@/lib/api-apostas';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_apostador = searchParams.get('id_apostador') || undefined;
    const data = await ApostasService.listarTodas(id_apostador);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await ApostasService.criar(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
