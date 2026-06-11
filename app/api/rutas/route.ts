import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conductor_id = searchParams.get('conductor_id');

    const [rows]: any = await db.execute(
      `SELECT r.*, u.nombre as conductor_nombre 
       FROM rutas r 
       JOIN usuarios u ON r.conductor_id = u.id
       WHERE r.conductor_id = ?
       ORDER BY r.fecha DESC, r.hora_salida DESC`,
      [conductor_id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('ERROR RUTAS GET:', error);
    return NextResponse.json({ error: 'Error al obtener rutas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { conductor_id, origen, destino, hora_salida, puestos, tipo_origen, fecha } = await request.json();

    if (!conductor_id || !origen || !destino || !hora_salida || !fecha) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Validar que la fecha+hora no sea en el pasado (zona horaria Colombia UTC-5)
    const ahoraColombia = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const fechaHoraRuta = new Date(`${fecha}T${hora_salida}:00`);

    if (fechaHoraRuta <= ahoraColombia) {
      return NextResponse.json({ error: 'No puedes publicar una ruta con fecha y hora en el pasado' }, { status: 400 });
    }

    await db.execute(
      `INSERT INTO rutas (conductor_id, tipo_origen, origen, destino, hora_salida, puestos_disponibles, puestos_totales, estado, fecha)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'activa', ?)`,
      [conductor_id, tipo_origen, origen, destino, hora_salida, puestos, puestos, fecha]
    );

    return NextResponse.json({ mensaje: 'Ruta publicada exitosamente' }, { status: 201 });
  } catch (error: any) {
    console.error('ERROR RUTAS POST:', error);
    return NextResponse.json({ error: 'Error al publicar ruta' }, { status: 500 });
  }
}