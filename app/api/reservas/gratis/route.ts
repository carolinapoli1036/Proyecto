import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { ruta_id, pasajero_id } = await request.json();

    const [usuarios]: any = await db.execute(
      'SELECT puntos FROM usuarios WHERE id = ?',
      [pasajero_id]
    );

    if (usuarios[0]?.puntos < 70) {
      return NextResponse.json({ error: 'No tienes suficientes puntos para un viaje gratis' }, { status: 400 });
    }

    const [rutas]: any = await db.execute(
      'SELECT puestos_disponibles FROM rutas WHERE id = ?',
      [ruta_id]
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
      'UPDATE usuarios SET puntos = puntos - 70 WHERE id = ?',
      [pasajero_id]
    );

    const [updatedUser]: any = await db.execute(
      'SELECT puntos FROM usuarios WHERE id = ?',
      [pasajero_id]
    );

    return NextResponse.json({
      mensaje: 'Viaje gratis aplicado exitosamente',
      puntos_restantes: updatedUser[0]?.puntos ?? 0,
    }, { status: 201 });

  } catch (error: any) {
    console.error('ERROR VIAJE GRATIS:', error);
    return NextResponse.json({ error: 'Error al aplicar viaje gratis' }, { status: 500 });
  }
}