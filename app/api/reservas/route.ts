import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { ruta_id, pasajero_id } = await request.json();

    const [rutas]: any = await db.execute(
      `SELECT r.puestos_disponibles, r.conductor_id, r.origen, r.destino, u.nombre as pasajero_nombre
       FROM rutas r JOIN usuarios u ON u.id = ?
       WHERE r.id = ?`,
      [pasajero_id, ruta_id]
    );

    if (rutas.length === 0 || rutas[0].puestos_disponibles === 0) {
      return NextResponse.json({ error: 'No hay puestos disponibles' }, { status: 400 });
    }

    const [reservaExistente]: any = await db.execute(
      'SELECT id FROM reservas WHERE ruta_id = ? AND pasajero_id = ?',
      [ruta_id, pasajero_id]
    );

    if (reservaExistente.length > 0) {
      return NextResponse.json({ error: 'Ya tienes una reserva en esta ruta' }, { status: 400 });
    }

    await db.execute(
      'INSERT INTO reservas (ruta_id, pasajero_id, estado) VALUES (?, ?, ?)',
      [ruta_id, pasajero_id, 'confirmada']
    );

    await db.execute(
      'UPDATE rutas SET puestos_disponibles = puestos_disponibles - 1 WHERE id = ?',
      [ruta_id]
    );

    await db.execute(
      'INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)',
      [rutas[0].conductor_id, `${rutas[0].pasajero_nombre} reservó tu ruta ${rutas[0].origen} → ${rutas[0].destino}`]
    );

    return NextResponse.json({ mensaje: 'Reserva realizada exitosamente' }, { status: 201 });
  } catch (error: any) {
    console.error('ERROR RESERVAS:', error);
    return NextResponse.json({ error: 'Error al realizar reserva' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pasajero_id = searchParams.get('pasajero_id');
    const [rows]: any = await db.execute(
      `SELECT res.*, r.origen, r.destino, r.hora_salida, u.nombre as conductor_nombre
       FROM reservas res
       JOIN rutas r ON res.ruta_id = r.id
       JOIN usuarios u ON r.conductor_id = u.id
       WHERE res.pasajero_id = ?
       ORDER BY res.creado_en DESC`,
      [pasajero_id]
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('ERROR RESERVAS GET:', error);
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
}