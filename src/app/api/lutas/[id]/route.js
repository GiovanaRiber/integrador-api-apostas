import { NextResponse } from 'next/server';
import { LutasService } from '@/lib/api-lutas';

export async function GET(request, { params }) {
  try {
    const data = await LutasService.buscarPorId(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const data = await LutasService.atualizar(params.id, body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const data = await LutasService.deletar(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
