import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reserva_id = searchParams.get('reserva_id');

    const [mensajes]: any = await db.execute(
      `SELECT m.*, u.nombre as remitente_nombre
       FROM mensajes m
       JOIN usuarios u ON m.remitente_id = u.id
       WHERE m.reserva_id = ?
       ORDER BY m.creado_en ASC`,
      [reserva_id]
    );

    return NextResponse.json(mensajes);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { reserva_id, remitente_id, mensaje } = await request.json();

    if (!reserva_id || !remitente_id || !mensaje) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    await db.execute(
      'INSERT INTO mensajes (reserva_id, remitente_id, mensaje) VALUES (?, ?, ?)',
      [reserva_id, remitente_id, mensaje]
    );

    return NextResponse.json({ mensaje: 'Mensaje enviado' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 500 });
  }
}