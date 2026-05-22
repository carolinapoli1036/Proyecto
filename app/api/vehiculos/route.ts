import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { conductor_id, placa, marca, modelo, color, puestos } = await request.json();

    const [result]: any = await db.execute(
      'INSERT INTO vehiculos (conductor_id, placa, marca, modelo, color, puestos) VALUES (?, ?, ?, ?, ?, ?)',
      [conductor_id, placa, marca, modelo, color, puestos]
    );

    return NextResponse.json({ mensaje: 'Vehículo registrado exitosamente' }, { status: 201 });

  } catch (error: any) {
    console.error('ERROR VEHICULOS:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Esa placa ya está registrada' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al registrar vehículo' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conductor_id = searchParams.get('conductor_id');

    const [rows]: any = await db.execute(
      'SELECT * FROM vehiculos WHERE conductor_id = ?',
      [conductor_id]
    );

    return NextResponse.json(rows[0] ?? null);

  } catch (error: any) {
    console.error('ERROR VEHICULOS GET:', error);
    return NextResponse.json({ error: 'Error al obtener vehículo' }, { status: 500 });
  }
}