import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { nombre, correo, contrasena, perfil, universidad } = await request.json();

    const [result]: any = await db.execute(
      'INSERT INTO usuarios (nombre, correo, contrasena, perfil, universidad) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, contrasena, perfil, universidad]
    );

    return NextResponse.json({ mensaje: 'Usuario registrado exitosamente' }, { status: 201 });

  } catch (error: any) {
    console.error('ERROR DETALLADO:', error); // ← línea nueva
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}