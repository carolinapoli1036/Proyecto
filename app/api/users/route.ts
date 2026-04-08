import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET — obtener todos los usuarios
export async function GET() {
  try {
    const [rows]: any = await db.execute('SELECT id, nombre, correo, perfil, universidad FROM usuarios');
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

// POST — crear usuario
export async function POST(request: Request) {
  try {
    const { nombre, correo, contrasena, perfil, universidad } = await request.json();
    await db.execute(
      'INSERT INTO usuarios (nombre, correo, contrasena, perfil, universidad) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, contrasena, perfil, universidad]
    );
    return NextResponse.json({ mensaje: 'Usuario creado exitosamente' }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}

// PUT — editar usuario
export async function PUT(request: Request) {
  try {
    const { id, nombre, correo, perfil, universidad } = await request.json();
    await db.execute(
      'UPDATE usuarios SET nombre = ?, correo = ?, perfil = ?, universidad = ? WHERE id = ?',
      [nombre, correo, perfil, universidad, id]
    );
    return NextResponse.json({ mensaje: 'Usuario actualizado exitosamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

// DELETE — eliminar usuario
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    return NextResponse.json({ mensaje: 'Usuario eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}