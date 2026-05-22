import { NextResponse } from 'next/server';
import db from '@/lib/db';

const coordenadas: Record<string, [number, number]> = {
  'Estación Niquía': [6.3387, -75.5078],
  'Estación Acevedo': [6.2901, -75.5567],
  'Estación Caribe': [6.2701, -75.5657],
  'Estación Universidad': [6.2601, -75.5678],
  'Estación Industriales': [6.2351, -75.5678],
  'Estación San Antonio': [6.2201, -75.5678],
  'Estación El Poblado': [6.2101, -75.5678],
  'Estación Aguacatala': [6.1901, -75.5778],
  'Estación Ayurá': [6.1701, -75.5878],
  'Estación Envigado': [6.1601, -75.5878],
  'Estación Itagüí': [6.1501, -75.5878],
  'Estación La Estrella': [6.1401, -75.5878],
  'Estación Sabaneta': [6.1501, -75.5978],
  'Comuna 1 - Popular': [6.2901, -75.5401],
  'Comuna 2 - Santa Cruz': [6.2801, -75.5501],
  'Comuna 3 - Manrique': [6.2701, -75.5401],
  'Comuna 4 - Aranjuez': [6.2801, -75.5601],
  'Comuna 5 - Castilla': [6.2901, -75.5901],
  'Comuna 6 - Doce de Octubre': [6.2801, -75.5801],
  'Comuna 7 - Robledo': [6.2701, -75.6001],
  'Comuna 8 - Villa Hermosa': [6.2401, -75.5401],
  'Comuna 9 - Buenos Aires': [6.2301, -75.5501],
  'Comuna 10 - La Candelaria': [6.2501, -75.5678],
  'Comuna 11 - Laureles': [6.2401, -75.5901],
  'Comuna 12 - La América': [6.2301, -75.5901],
  'Comuna 13 - San Javier': [6.2301, -75.6101],
  'Comuna 14 - El Poblado': [6.2001, -75.5678],
  'Comuna 15 - Guayabal': [6.2101, -75.5878],
  'Comuna 16 - Belén': [6.2201, -75.6001],
  'Bello': [6.3378, -75.5567],
  'Itagüí': [6.1701, -75.5997],
  'Envigado': [6.1701, -75.5878],
  'Sabaneta': [6.1501, -75.5978],
  'La Estrella': [6.1401, -75.5878],
  'Caldas': [6.0901, -75.6378],
  'Universidad de Antioquia': [6.2677, -75.5673],
  'Universidad Nacional de Colombia': [6.2677, -75.5673],
  'Universidad EAFIT': [6.2001, -75.5778],
  'Universidad Pontificia Bolivariana': [6.2401, -75.5901],
  'Universidad de Medellín': [6.2301, -75.6101],
  'Universidad CES': [6.2001, -75.5578],
  'Universidad Cooperativa de Colombia': [6.2501, -75.5801],
  'Universidad Autónoma Latinoamericana': [6.2551, -75.5678],
  'Universidad Remington': [6.2451, -75.5678],
  'Universidad San Buenaventura': [6.2601, -75.6001],
  'Politécnico Colombiano Jaime Isaza Cadavid': [6.2351, -75.5801],
  'Instituto Tecnológico Metropolitano': [6.2651, -75.5573],
  'Institución Universitaria Pascual Bravo': [6.2701, -75.5901],
  'Institución Universitaria Colegio Mayor': [6.2251, -75.5678],
  'Tecnológico de Antioquia': [6.2801, -75.5573],
  'SENA Regional Antioquia': [6.2451, -75.5801],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // 'pasajero', 'conductor', 'admin'
    const usuario_id = searchParams.get('usuario_id');

    let rutas: any[] = [];

    if (tipo === 'conductor') {
      const [rows]: any = await db.execute(
        `SELECT r.*, u.nombre as conductor_nombre,
          (SELECT COUNT(*) FROM reservas res WHERE res.ruta_id = r.id AND res.estado != 'cancelada') as reservas_count
         FROM rutas r JOIN usuarios u ON r.conductor_id = u.id
         WHERE r.conductor_id = ? AND r.estado = 'activa'`,
        [usuario_id]
      );
      rutas = rows;
    } else if (tipo === 'pasajero') {
      const [rows]: any = await db.execute(
        `SELECT r.*, u.nombre as conductor_nombre,
          (SELECT COUNT(*) FROM reservas res WHERE res.ruta_id = r.id AND res.estado != 'cancelada') as reservas_count
         FROM rutas r JOIN usuarios u ON r.conductor_id = u.id
         WHERE r.estado = 'activa' AND r.puestos_disponibles > 0`,
      );
      rutas = rows;
    } else if (tipo === 'admin') {
      const [rows]: any = await db.execute(
        `SELECT r.*, u.nombre as conductor_nombre,
          (SELECT COUNT(*) FROM reservas res WHERE res.ruta_id = r.id AND res.estado != 'cancelada') as reservas_count
         FROM rutas r JOIN usuarios u ON r.conductor_id = u.id
         WHERE r.estado = 'activa'`
      );
      rutas = rows;
    }

    const rutasConCoords = rutas
      .filter(r => coordenadas[r.origen] && coordenadas[r.destino])
      .map(r => ({
        ...r,
        coord_origen: coordenadas[r.origen],
        coord_destino: coordenadas[r.destino],
        tiene_reservas: r.reservas_count > 0,
      }));

    return NextResponse.json(rutasConCoords);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener rutas' }, { status: 500 });
  }
}