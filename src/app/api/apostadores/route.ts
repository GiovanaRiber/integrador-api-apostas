import { NextResponse } from 'next/server';
import { ApostadoresService } from '@/lib/api-apostadores';

export async function GET() {
  try {
    const data = await ApostadoresService.listarTodos();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await ApostadoresService.criar(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
