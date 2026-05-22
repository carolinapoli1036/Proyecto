import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { reserva_id } = await request.json();

    if (!reserva_id) {
      return NextResponse.json({ error: 'reserva_id es requerido' }, { status: 400 });
    }

    // Obtener la reserva para saber el pasajero
    const [reservas]: any = await db.execute(
      'SELECT * FROM reservas WHERE id = ? AND estado = ?',
      [reserva_id, 'confirmada']
    );

    if (reservas.length === 0) {
      return NextResponse.json({ error: 'Reserva no encontrada o ya completada' }, { status: 404 });
    }

    const reserva = reservas[0];

    // Marcar reserva como completada
    await db.execute(
      'UPDATE reservas SET estado = ? WHERE id = ?',
      ['completada', reserva_id]
    );

    // Sumar 10 puntos al pasajero
    await db.execute(
      'UPDATE usuarios SET puntos = puntos + 10 WHERE id = ?',
      [reserva.pasajero_id]
    );

    // Obtener puntos actuales del pasajero
    const [usuarios]: any = await db.execute(
      'SELECT puntos FROM usuarios WHERE id = ?',
      [reserva.pasajero_id]
    );

    const puntosActuales = usuarios[0]?.puntos ?? 0;
    const viajesGratis = Math.floor(puntosActuales / 70);

    return NextResponse.json({
      mensaje: 'Viaje completado exitosamente',
      puntos: puntosActuales,
      viajes_gratis: viajesGratis,
    });

  } catch (error: any) {
    console.error('ERROR COMPLETAR:', error);
    return NextResponse.json({ error: error.message ?? 'Error al completar viaje' }, { status: 500 });
  }
}