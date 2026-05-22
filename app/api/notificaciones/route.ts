import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario_id = searchParams.get('usuario_id');

    const [rows]: any = await db.execute(
      `SELECT * FROM notificaciones 
       WHERE usuario_id = ? 
       ORDER BY creado_en DESC 
       LIMIT 20`,
      [usuario_id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { usuario_id } = await request.json();
    await db.execute(
      'UPDATE notificaciones SET leida = 1 WHERE usuario_id = ?',
      [usuario_id]
    );
    return NextResponse.json({ mensaje: 'Notificaciones marcadas como leidas' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al marcar notificaciones' }, { status: 500 });
  }
}