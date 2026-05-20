import { NextResponse } from 'next/server';
import { LutadoresService } from '@/lib/api-lutadores';

export async function GET() {
  try {
    const data = await LutadoresService.listarTodos();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await LutadoresService.criar(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
