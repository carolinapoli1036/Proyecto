import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    await db.execute(
      `UPDATE rutas SET fecha = CURDATE() WHERE fecha IS NULL`
    );
    return NextResponse.json({ mensaje: 'Fechas actualizadas correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}