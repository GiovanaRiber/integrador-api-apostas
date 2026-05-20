import { NextResponse } from 'next/server';
import { LutadoresService } from '@/lib/api-lutadores';

export async function GET(request, { params }) {
  try {
    const data = await LutadoresService.buscarPorId(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const data = await LutadoresService.atualizar(params.id, body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const data = await LutadoresService.deletar(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
