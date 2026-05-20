import { NextResponse } from 'next/server';
import { LutadoresService } from '@/lib/api-lutadores';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await LutadoresService.buscarPorId(params.id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const data = await LutadoresService.atualizar(params.id, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await LutadoresService.deletar(params.id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
