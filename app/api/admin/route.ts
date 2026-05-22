import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    if (tipo === 'usuarios') {
      const [rows]: any = await db.execute(
        'SELECT id, nombre, correo, perfil, universidad FROM usuarios ORDER BY id DESC'
      );
      return NextResponse.json(rows);
    }

    if (tipo === 'vehiculos') {
      const [rows]: any = await db.execute(
        `SELECT v.*, u.nombre as conductor_nombre 
         FROM vehiculos v JOIN usuarios u ON v.conductor_id = u.id 
         ORDER BY v.id DESC`
      );
      return NextResponse.json(rows);
    }

    if (tipo === 'rutas') {
      const [rows]: any = await db.execute(
        `SELECT r.*, u.nombre as conductor_nombre,
          (SELECT COUNT(*) FROM reservas res WHERE res.ruta_id = r.id) as total_reservas
         FROM rutas r JOIN usuarios u ON r.conductor_id = u.id 
         ORDER BY r.id DESC`
      );
      return NextResponse.json(rows);
    }

    if (tipo === 'stats') {
      const [[{ total_usuarios }]]: any = await db.execute('SELECT COUNT(*) as total_usuarios FROM usuarios');
      const [[{ total_vehiculos }]]: any = await db.execute('SELECT COUNT(*) as total_vehiculos FROM vehiculos');
      const [[{ total_rutas }]]: any = await db.execute('SELECT COUNT(*) as total_rutas FROM rutas');
      const [[{ viajes_completados }]]: any = await db.execute(
        "SELECT COUNT(*) as viajes_completados FROM reservas WHERE estado = 'completada'"
      );
      return NextResponse.json({ total_usuarios, total_vehiculos, total_rutas, viajes_completados });
    }

    return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 });

  } catch (error: any) {
    console.error('ERROR ADMIN GET:', error);
    return NextResponse.json({ error: 'Error en admin' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const id = searchParams.get('id');

    if (!tipo || !id) {
      return NextResponse.json({ error: 'tipo e id requeridos' }, { status: 400 });
    }

    const tablas: Record<string, string> = {
      usuario: 'usuarios',
      vehiculo: 'vehiculos',
      ruta: 'rutas',
    };

    const tabla = tablas[tipo];
    if (!tabla) return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });

    await db.execute(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
    return NextResponse.json({ mensaje: `${tipo} eliminado exitosamente` });

  } catch (error: any) {
    console.error('ERROR ADMIN DELETE:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}