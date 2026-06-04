import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST() {
  try {
    // Rutas expiradas sin pasajeros → cancelada
    await db.execute(`
      UPDATE rutas 
      SET estado = 'cancelada'
      WHERE estado = 'activa'
      AND TIMESTAMP(fecha, hora_salida) < NOW() + INTERVAL 5 HOUR
      AND id NOT IN (
        SELECT DISTINCT ruta_id FROM reservas WHERE estado = 'confirmada'
      )
    `);

    // Rutas expiradas con pasajeros → completada
    const [rutasExpiradas]: any = await db.execute(`
      SELECT DISTINCT r.id 
      FROM rutas r
      JOIN reservas res ON res.ruta_id = r.id
      WHERE r.estado = 'activa'
      AND res.estado = 'confirmada'
      AND TIMESTAMP(r.fecha, r.hora_salida) < NOW() + INTERVAL 5 HOUR
    `);

    for (const ruta of rutasExpiradas) {
      await db.execute(
        "UPDATE rutas SET estado = 'completada' WHERE id = ?",
        [ruta.id]
      );

      const [reservas]: any = await db.execute(
        "SELECT * FROM reservas WHERE ruta_id = ? AND estado = 'confirmada'",
        [ruta.id]
      );

      for (const reserva of reservas) {
        await db.execute(
          "UPDATE reservas SET estado = 'completada' WHERE id = ?",
          [reserva.id]
        );

        await db.execute(
          "UPDATE usuarios SET puntos = puntos + 10 WHERE id = ?",
          [reserva.pasajero_id]
        );

        const [rutas]: any = await db.execute(
          "SELECT origen, destino FROM rutas WHERE id = ?",
          [ruta.id]
        );

        await db.execute(
          "INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)",
          [reserva.pasajero_id, `Tu viaje ${rutas[0].origen} → ${rutas[0].destino} fue completado automáticamente. +10 puntos`]
        );
      }
    }

    return NextResponse.json({ mensaje: 'Rutas expiradas procesadas' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}