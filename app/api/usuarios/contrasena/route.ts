import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const { correo, contrasena_nueva } = await request.json();

    const [usuarios]: any = await db.execute(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return NextResponse.json({ error: 'No existe una cuenta con ese correo' }, { status: 404 });
    }

    await db.execute(
      'UPDATE usuarios SET contrasena = ? WHERE correo = ?',
      [contrasena_nueva, correo]
    );

    return NextResponse.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar contraseña' }, { status: 500 });
  }
}