import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conductor_id = searchParams.get('conductor_id');

    if (!conductor_id) {
      return NextResponse.json({ error: 'conductor_id requerido' }, { status: 400 });
    }

    const [rows]: any = await db.execute(
      `SELECT r.*, 
        (SELECT COUNT(*) FROM reservas res WHERE res.ruta_id = r.id AND res.estado != 'cancelada') as reservas_count
       FROM rutas r
       WHERE r.conductor_id = ?
       ORDER BY r.hora_salida DESC`,
      [conductor_id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('ERROR RUTAS CONDUCTOR:', error);
    return NextResponse.json({ error: 'Error al obtener rutas' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { ruta_id, estado } = await request.json();

    if (!ruta_id || !estado) {
      return NextResponse.json({ error: 'ruta_id y estado son requeridos' }, { status: 400 });
    }

    if (estado === 'completada') {
      await db.execute(
        `UPDATE reservas SET estado = 'completada' WHERE ruta_id = ? AND estado = 'confirmada'`,
        [ruta_id]
      );
    }

    const [result]: any = await db.execute(
      'UPDATE rutas SET estado = ? WHERE id = ?',
      [estado, ruta_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ mensaje: 'Ruta actualizada exitosamente' });
  } catch (error: any) {
    console.error('ERROR ACTUALIZAR RUTA:', error);
    return NextResponse.json({ error: 'Error al actualizar ruta' }, { status: 500 });
  }
}