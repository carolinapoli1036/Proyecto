import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const { reserva_id } = await request.json();

    const [reservas]: any = await db.execute(
      "SELECT * FROM reservas WHERE id = ? AND estado = 'confirmada'",
      [reserva_id]
    );

    if (reservas.length === 0) {
      return NextResponse.json({ error: 'Reserva no encontrada o ya no se puede cancelar' }, { status: 404 });
    }

    const reserva = reservas[0];

    // Cancelar reserva
    await db.execute(
      "UPDATE reservas SET estado = 'cancelada' WHERE id = ?",
      [reserva_id]
    );

    // Devolver el puesto a la ruta
    await db.execute(
      "UPDATE rutas SET puestos_disponibles = puestos_disponibles + 1 WHERE id = ?",
      [reserva.ruta_id]
    );

    // Notificar al conductor
    const [rutas]: any = await db.execute(
      "SELECT conductor_id, origen, destino FROM rutas WHERE id = ?",
      [reserva.ruta_id]
    );

    const [usuarios]: any = await db.execute(
      "SELECT nombre FROM usuarios WHERE id = ?",
      [reserva.pasajero_id]
    );

    await db.execute(
      "INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)",
      [rutas[0].conductor_id, `${usuarios[0].nombre} canceló su reserva en la ruta ${rutas[0].origen} → ${rutas[0].destino}`]
    );

    return NextResponse.json({ mensaje: 'Reserva cancelada exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}