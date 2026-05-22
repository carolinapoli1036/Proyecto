import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { correo, contrasena } = await request.json();

    const [rows]: any = await db.execute(
      'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
      [correo, contrasena]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    const usuario = rows[0];

    return NextResponse.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        perfil: usuario.perfil,
        universidad: usuario.universidad,
        tipo_conductor: usuario.tipo_conductor,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('ERROR LOGIN:', error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}