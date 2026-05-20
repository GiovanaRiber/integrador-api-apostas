import { NextResponse } from 'next/server';
import { LutasService } from '@/lib/api-lutas';

export async function GET() {
  try {
    const data = await LutasService.listarTodas();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = await LutasService.criar(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
