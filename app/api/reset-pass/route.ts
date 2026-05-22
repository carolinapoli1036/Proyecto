import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const correo = searchParams.get('correo');
  
  await db.execute(
    'UPDATE usuarios SET contrasena = ? WHERE correo = ?',
    ['admin123', correo]
  );
  
  return NextResponse.json({ mensaje: 'Contraseña reseteada a: admin123' });
}