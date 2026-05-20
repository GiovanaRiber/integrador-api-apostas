import { NextResponse } from 'next/server';
import { ApostadoresService } from '@/lib/api-apostadores';

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const data = await ApostadoresService.atualizar(params.id, body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const data = await ApostadoresService.deletar(params.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
