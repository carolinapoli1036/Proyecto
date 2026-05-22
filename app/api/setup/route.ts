import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        mensaje TEXT NOT NULL,
        leida TINYINT DEFAULT 0,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);
    return NextResponse.json({ mensaje: 'Tabla notificaciones creada correctamente' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}