import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET: obtener rutas recurrentes de un conductor
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conductor_id = searchParams.get('conductor_id');

    const [rows]: any = await db.execute(
      `SELECT * FROM rutas_recurrentes 
       WHERE conductor_id = ? 
       ORDER BY id DESC`,
      [conductor_id]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('ERROR RUTAS RECURRENTES GET:', error);
    return NextResponse.json({ error: 'Error al obtener rutas recurrentes' }, { status: 500 });
  }
}

// POST: crear una ruta recurrente
export async function POST(request: Request) {
  try {
    const { conductor_id, origen, destino, hora_salida, dias_semana, puestos, punto_encuentro } = await request.json();

    if (!conductor_id || !origen || !destino || !hora_salida || !dias_semana || dias_semana.length === 0) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const fecha_inicio = new Date().toISOString().split('T')[0];

    await db.execute(
      `INSERT INTO rutas_recurrentes 
       (conductor_id, origen, destino, hora_salida, dias_semana, puestos, punto_encuentro, activa, fecha_inicio)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [conductor_id, origen, destino, hora_salida, dias_semana.join(','), puestos || 4, punto_encuentro || null, fecha_inicio]
    );

    await generarRutasSiCorresponde(conductor_id);

    return NextResponse.json({ mensaje: 'Ruta recurrente creada exitosamente' }, { status: 201 });
  } catch (error: any) {
    console.error('ERROR RUTAS RECURRENTES POST:', error);
    return NextResponse.json({ error: 'Error al crear ruta recurrente' }, { status: 500 });
  }
}

// PATCH: pausar o activar una ruta recurrente
export async function PATCH(request: Request) {
  try {
    const { id, activa } = await request.json();

    await db.execute(
      'UPDATE rutas_recurrentes SET activa = ? WHERE id = ?',
      [activa ? 1 : 0, id]
    );

    return NextResponse.json({ mensaje: activa ? 'Ruta activada' : 'Ruta pausada' });
  } catch (error: any) {
    console.error('ERROR RUTAS RECURRENTES PATCH:', error);
    return NextResponse.json({ error: 'Error al actualizar ruta recurrente' }, { status: 500 });
  }
}

// DELETE: eliminar una ruta recurrente
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await db.execute('DELETE FROM rutas_recurrentes WHERE id = ?', [id]);

    return NextResponse.json({ mensaje: 'Ruta recurrente eliminada' });
  } catch (error: any) {
    console.error('ERROR RUTAS RECURRENTES DELETE:', error);
    return NextResponse.json({ error: 'Error al eliminar ruta recurrente' }, { status: 500 });
  }
}

// Función interna: genera rutas normales a partir de las recurrentes activas
async function generarRutasSiCorresponde(conductor_id?: number) {
  try {
    const hoy = new Date();
    const diaSemanaHoy = hoy.getDay() === 0 ? 7 : hoy.getDay();
    const fechaHoy = hoy.toISOString().split('T')[0];

    let query = 'SELECT * FROM rutas_recurrentes WHERE activa = 1';
    const params: any[] = [];
    if (conductor_id) {
      query += ' AND conductor_id = ?';
      params.push(conductor_id);
    }

    const [recurrentes]: any = await db.execute(query, params);

    for (const rr of recurrentes) {
      const dias = rr.dias_semana.split(',').map(Number);
      if (!dias.includes(diaSemanaHoy)) continue;

      const [existe]: any = await db.execute(
        `SELECT id FROM rutas 
         WHERE conductor_id = ? AND origen = ? AND destino = ? 
         AND hora_salida = ? AND fecha = ?`,
        [rr.conductor_id, rr.origen, rr.destino, rr.hora_salida, fechaHoy]
      );

      if (existe.length > 0) continue;

      await db.execute(
        `INSERT INTO rutas 
         (conductor_id, origen, destino, hora_salida, puestos_disponibles, puestos_totales, estado, fecha, punto_encuentro, contribucion)
         VALUES (?, ?, ?, ?, ?, ?, 'activa', ?, ?, 7000)`,
        [rr.conductor_id, rr.origen, rr.destino, rr.hora_salida, rr.puestos, rr.puestos, fechaHoy, rr.punto_encuentro || null]
      );
    }
  } catch (error) {
    console.error('ERROR generarRutasSiCorresponde:', error);
  }
}