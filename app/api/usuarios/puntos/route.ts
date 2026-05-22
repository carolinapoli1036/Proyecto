import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario_id = searchParams.get('usuario_id');
    const [rows]: any = await db.execute(
      'SELECT puntos FROM usuarios WHERE id = ?',
      [usuario_id]
    );
    return NextResponse.json({ puntos: rows[0]?.puntos ?? 0 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener puntos' }, { status: 500 });
  }
}