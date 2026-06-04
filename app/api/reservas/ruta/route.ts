import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ruta_id = searchParams.get('ruta_id');

    const [rows]: any = await db.execute(
      `SELECT res.*, u.nombre as pasajero_nombre
       FROM reservas res
       JOIN usuarios u ON res.pasajero_id = u.id
       WHERE res.ruta_id = ? AND res.estado != 'cancelada'
       ORDER BY res.creado_en ASC`,
      [ruta_id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}