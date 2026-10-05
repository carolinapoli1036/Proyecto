import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { reserva_id, calificador_id, calificado_id, estrellas, comentario } = await request.json();

    if (!reserva_id || !calificador_id || !calificado_id || !estrellas) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    if (estrellas < 1 || estrellas > 5) {
      return NextResponse.json({ error: 'Las estrellas deben ser entre 1 y 5' }, { status: 400 });
    }

    // Verificar que la reserva está completada
    const [reservas]: any = await db.execute(
      "SELECT id FROM reservas WHERE id = ? AND estado = 'completada'",
      [reserva_id]
    );
    if (reservas.length === 0) {
      return NextResponse.json({ error: 'Solo puedes calificar viajes completados' }, { status: 400 });
    }

    // Verificar que no haya calificado ya
    const [existe]: any = await db.execute(
      'SELECT id FROM calificaciones WHERE reserva_id = ? AND calificador_id = ?',
      [reserva_id, calificador_id]
    );
    if (existe.length > 0) {
      return NextResponse.json({ error: 'Ya calificaste este viaje' }, { status: 400 });
    }

    await db.execute(
      'INSERT INTO calificaciones (reserva_id, calificador_id, calificado_id, estrellas, comentario) VALUES (?, ?, ?, ?, ?)',
      [reserva_id, calificador_id, calificado_id, estrellas, comentario || null]
    );

    return NextResponse.json({ mensaje: 'Calificación enviada exitosamente' }, { status: 201 });
  } catch (error: any) {
    console.error('ERROR CALIFICACIONES POST:', error);
    return NextResponse.json({ error: 'Error al guardar calificación' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario_id = searchParams.get('usuario_id');

    if (!usuario_id) {
      return NextResponse.json({ error: 'usuario_id requerido' }, { status: 400 });
    }

    const [rows]: any = await db.execute(
      `SELECT c.*, u.nombre as calificador_nombre
       FROM calificaciones c
       JOIN usuarios u ON c.calificador_id = u.id
       WHERE c.calificado_id = ?
       ORDER BY c.fecha DESC`,
      [usuario_id]
    );

    // Calcular promedio
    const promedio = rows.length > 0
      ? (rows.reduce((acc: number, r: any) => acc + r.estrellas, 0) / rows.length).toFixed(1)
      : null;

    return NextResponse.json({ calificaciones: rows, promedio, total: rows.length });
  } catch (error: any) {
    console.error('ERROR CALIFICACIONES GET:', error);
    return NextResponse.json({ error: 'Error al obtener calificaciones' }, { status: 500 });
  }
}