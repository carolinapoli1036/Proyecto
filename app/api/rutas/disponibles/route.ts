import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const origen = searchParams.get('origen');
    const destino = searchParams.get('destino');

    let query = `
      SELECT r.*, u.nombre as conductor_nombre 
      FROM rutas r 
      JOIN usuarios u ON r.conductor_id = u.id
      WHERE r.estado = 'activa' AND r.puestos_disponibles > 0
      AND (r.fecha >= CURDATE() OR r.fecha IS NULL)
    `;
    const params: any[] = [];

    if (origen) { query += ' AND r.origen = ?'; params.push(origen); }
    if (destino) { query += ' AND r.destino = ?'; params.push(destino); }
    query += ' ORDER BY r.fecha ASC, r.hora_salida ASC';

    const [rows]: any = await db.execute(query, params);
    return NextResponse.json(rows);

  } catch (error: any) {
    console.error('ERROR RUTAS DISPONIBLES:', error);
    return NextResponse.json({ error: 'Error al obtener rutas' }, { status: 500 });
  }
}