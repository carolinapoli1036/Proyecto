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

export async function POST(request: Request) {
  try {
    const { tipo, datos } = await request.json();

    if (tipo === 'usuario') {
      if (!datos.nombre || !datos.correo || !datos.contrasena || !datos.perfil || !datos.universidad) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
      }
      await db.execute(
        'INSERT INTO usuarios (nombre, correo, contrasena, perfil, universidad) VALUES (?, ?, ?, ?, ?)',
        [datos.nombre, datos.correo, datos.contrasena, datos.perfil, datos.universidad]
      );
      return NextResponse.json({ mensaje: 'Usuario creado exitosamente' }, { status: 201 });
    }

    if (tipo === 'vehiculo') {
      if (!datos.conductor_id || !datos.placa || !datos.marca || !datos.modelo || !datos.color || !datos.puestos) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
      }
      await db.execute(
        'INSERT INTO vehiculos (conductor_id, placa, marca, modelo, color, puestos) VALUES (?, ?, ?, ?, ?, ?)',
        [datos.conductor_id, datos.placa, datos.marca, datos.modelo, datos.color, datos.puestos]
      );
      return NextResponse.json({ mensaje: 'Vehiculo creado exitosamente' }, { status: 201 });
    }

    if (tipo === 'ruta') {
      if (!datos.conductor_id || !datos.origen || !datos.destino || !datos.hora_salida || !datos.fecha || !datos.puestos) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
      }
      await db.execute(
        `INSERT INTO rutas (conductor_id, origen, destino, hora_salida, fecha, puestos_disponibles, puestos_totales, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'activa')`,
        [datos.conductor_id, datos.origen, datos.destino, datos.hora_salida, datos.fecha, datos.puestos, datos.puestos]
      );
      return NextResponse.json({ mensaje: 'Ruta creada exitosamente' }, { status: 201 });
    }

    return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 });
  } catch (error: any) {
    console.error('ERROR ADMIN POST:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'El correo o placa ya está registrado' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { tipo, id, datos } = await request.json();

    if (tipo === 'usuario') {
      await db.execute(
        'UPDATE usuarios SET nombre = ?, correo = ?, perfil = ?, universidad = ? WHERE id = ?',
        [datos.nombre, datos.correo, datos.perfil, datos.universidad, id]
      );
      return NextResponse.json({ mensaje: 'Usuario actualizado exitosamente' });
    }

    if (tipo === 'vehiculo') {
      await db.execute(
        'UPDATE vehiculos SET placa = ?, marca = ?, modelo = ?, color = ?, puestos = ? WHERE id = ?',
        [datos.placa, datos.marca, datos.modelo, datos.color, datos.puestos, id]
      );
      return NextResponse.json({ mensaje: 'Vehiculo actualizado exitosamente' });
    }

    if (tipo === 'ruta') {
      await db.execute(
        'UPDATE rutas SET origen = ?, destino = ?, hora_salida = ?, fecha = ?, estado = ? WHERE id = ?',
        [datos.origen, datos.destino, datos.hora_salida, datos.fecha, datos.estado, id]
      );
      return NextResponse.json({ mensaje: 'Ruta actualizada exitosamente' });
    }

    return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 });
  } catch (error: any) {
    console.error('ERROR ADMIN PUT:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
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