import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const correo = searchParams.get('correo');
  
  await db.execute(
    'UPDATE usuarios SET perfil = ? WHERE correo = ?',
    ['admin', correo]
  );
  
  return NextResponse.json({ mensaje: 'Usuario actualizado a admin' });
}