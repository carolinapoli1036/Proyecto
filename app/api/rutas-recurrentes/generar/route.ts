import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST() {
  try {
    const hoy = new Date();
    const diaSemanaHoy = hoy.getDay() === 0 ? 7 : hoy.getDay();
    const fechaHoy = hoy.toISOString().split('T')[0];

    const [recurrentes]: any = await db.execute(
      'SELECT * FROM rutas_recurrentes WHERE activa = 1'
    );

    let generadas = 0;

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
      generadas++;
    }

    return NextResponse.json({ mensaje: `${generadas} rutas generadas` });
  } catch (error: any) {
    console.error('ERROR GENERAR RUTAS:', error);
    return NextResponse.json({ error: 'Error al generar rutas' }, { status: 500 });
  }
}