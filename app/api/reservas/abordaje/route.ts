import { NextResponse } from 'next/server';
import db from '@/lib/db';

// PATCH /api/reservas/abordaje
// El conductor marca si un pasajero abordó o no
export async function PATCH(request: Request) {
  try {
    const { reserva_id, abordaje_confirmado } = await request.json();

    if (reserva_id === undefined || abordaje_confirmado === undefined) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    await db.execute(
      'UPDATE reservas SET abordaje_confirmado = ? WHERE id = ?',
      [abordaje_confirmado ? 1 : 0, reserva_id]
    );

    return NextResponse.json({ mensaje: 'Abordaje actualizado' });
  } catch (error) {
    console.error('ERROR ABORDAJE:', error);
    return NextResponse.json({ error: 'Error al actualizar abordaje' }, { status: 500 });
  }
}