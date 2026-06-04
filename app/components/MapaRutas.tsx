'use client';
import { useEffect, useState, useRef } from 'react';

interface RutaMapa {
  id: number;
  origen: string;
  destino: string;
  conductor_nombre: string;
  hora_salida: string;
  puestos_disponibles: number;
  reservas_count: number;
  tiene_reservas: boolean;
  coord_origen: [number, number];
  coord_destino: [number, number];
}

interface Props {
  tipo: 'pasajero' | 'conductor' | 'admin';
  usuario_id?: number;
}

const puntosReferencia = [
  // Estaciones Metro Línea A (Norte-Sur)
  { nombre: 'Estación Niquía', coord: [6.3387, -75.5078] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Bello', coord: [6.3378, -75.5567] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Madera', coord: [6.3201, -75.5567] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Acevedo', coord: [6.2901, -75.5567] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Tricentenario', coord: [6.2801, -75.5567] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Caribe', coord: [6.2701, -75.5657] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Universidad', coord: [6.2601, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Hospital', coord: [6.2501, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Prado', coord: [6.2451, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Industriales', coord: [6.2351, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Exposiciones', coord: [6.2251, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación San Antonio', coord: [6.2201, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Alpujarra', coord: [6.2151, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación El Poblado', coord: [6.2101, -75.5678] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Aguacatala', coord: [6.1901, -75.5778] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Ayurá', coord: [6.1701, -75.5878] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Envigado', coord: [6.1601, -75.5878] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Itagüí', coord: [6.1501, -75.5878] as [number, number], tipo: 'metro' },
  { nombre: 'Estación La Estrella', coord: [6.1401, -75.5878] as [number, number], tipo: 'metro' },
  { nombre: 'Estación Sabaneta', coord: [6.1501, -75.5978] as [number, number], tipo: 'metro' },
  // Universidades
  { nombre: 'Universidad de Antioquia', coord: [6.2677, -75.5673] as [number, number], tipo: 'universidad' },
  { nombre: 'Universidad Nacional', coord: [6.2677, -75.5673] as [number, number], tipo: 'universidad' },
  { nombre: 'Universidad EAFIT', coord: [6.2001, -75.5778] as [number, number], tipo: 'universidad' },
  { nombre: 'Universidad Pontificia Bolivariana', coord: [6.2401, -75.5901] as [number, number], tipo: 'universidad' },
  { nombre: 'Universidad de Medellín', coord: [6.2301, -75.6101] as [number, number], tipo: 'universidad' },
  { nombre: 'Universidad CES', coord: [6.2001, -75.5578] as [number, number], tipo: 'universidad' },
  { nombre: 'Politécnico Colombiano', coord: [6.2351, -75.5801] as [number, number], tipo: 'universidad' },
  { nombre: 'ITM', coord: [6.2651, -75.5573] as [number, number], tipo: 'universidad' },
  { nombre: 'Pascual Bravo', coord: [6.2701, -75.5901] as [number, number], tipo: 'universidad' },
  { nombre: 'Tecnológico de Antioquia', coord: [6.2801, -75.5573] as [number, number], tipo: 'universidad' },
  { nombre: 'UNAULA', coord: [6.2551, -75.5678] as [number, number], tipo: 'universidad' },
  { nombre: 'SENA', coord: [6.2451, -75.5801] as [number, number], tipo: 'universidad' },
];

export default function MapaRutas({ tipo, usuario_id }: Props) {
  const [rutas, setRutas] = useState<RutaMapa[]>([]);
  const [mounted, setMounted] = useState(false);
  const mapaId = useRef(`mapa-${tipo}-${Math.random().toString(36).substr(2, 9)}`);
  const mapRef = useRef<any>(null);
  const sans = "'DM Sans', system-ui, sans-serif";

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams({ tipo });
    if (usuario_id) params.append('usuario_id', String(usuario_id));
    fetch(`/api/rutas/mapa?${params}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRutas(data); });
  }, [tipo, usuario_id]);

  useEffect(() => {
    if (!mounted) return;

    const L = require('leaflet');

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const contenedor = document.getElementById(mapaId.current);
    if (!contenedor) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapaId.current).setView([6.2442, -75.5812], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Puntos de referencia fijos (metro y universidades)
    puntosReferencia.forEach(punto => {
      const esMetro = punto.tipo === 'metro';
      const icon = L.divIcon({
        html: `<div style="width:10px;height:10px;background:${esMetro ? '#6b6b6b' : '#9E9890'};border-radius:50%;border:1.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      L.marker(punto.coord, { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;font-size:12px;"><strong>${punto.nombre}</strong><br/><span style="color:#9E9890;">${esMetro ? 'Estación Metro' : 'Universidad'}</span></div>`);
    });

    // Rutas activas
    const rutasActivas = rutas.filter(r => !r.tiene_reservas);
    const rutasReservadas = rutas.filter(r => r.tiene_reservas);

    rutasActivas.forEach(ruta => {
      const iconO = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#D6CCC2;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        className: '', iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const iconD = L.divIcon({
        html: `<div style="width:12px;height:12px;background:#9E9890;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        className: '', iconSize: [12, 12], iconAnchor: [6, 6],
      });
      L.polyline([ruta.coord_origen, ruta.coord_destino], { color: '#D6CCC2', weight: 2.5, opacity: 0.8, dashArray: '6,6' }).addTo(map);
      L.marker(ruta.coord_origen, { icon: iconO }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;font-size:12px;min-width:160px;"><strong>${ruta.origen}</strong><br/><span style="color:#9E9890;">→ ${ruta.destino}</span><br/><br/>Conductor: ${ruta.conductor_nombre}<br/>Hora: ${ruta.hora_salida}<br/>Puestos: ${ruta.puestos_disponibles}</div>`);
      L.marker(ruta.coord_destino, { icon: iconD }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;font-size:12px;"><strong>Destino:</strong> ${ruta.destino}</div>`);
    });

    rutasReservadas.forEach(ruta => {
      const iconO = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#fbbf24;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        className: '', iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const iconD = L.divIcon({
        html: `<div style="width:12px;height:12px;background:#f59e0b;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
        className: '', iconSize: [12, 12], iconAnchor: [6, 6],
      });
      L.polyline([ruta.coord_origen, ruta.coord_destino], { color: '#fbbf24', weight: 2.5, opacity: 0.8 }).addTo(map);
      L.marker(ruta.coord_origen, { icon: iconO }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;font-size:12px;min-width:160px;"><strong>${ruta.origen}</strong><br/><span style="color:#9E9890;">→ ${ruta.destino}</span><br/><br/>Conductor: ${ruta.conductor_nombre}<br/>Hora: ${ruta.hora_salida}<br/>Puestos: ${ruta.puestos_disponibles}<br/><span style="color:#f59e0b;">Con ${ruta.reservas_count} reserva(s)</span></div>`);
      L.marker(ruta.coord_destino, { icon: iconD }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;font-size:12px;"><strong>Destino:</strong> ${ruta.destino}</div>`);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mounted, rutas]);

  if (!mounted) return null;

  return (
    <div style={{ width: '100%' }}>
      <div id={mapaId.current} style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }} />
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#6b6b6b', borderRadius: '50%' }} />
          <span style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>Estación Metro</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#9E9890', borderRadius: '50%' }} />
          <span style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>Universidad</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#D6CCC2', borderRadius: '50%', border: '1.5px solid #fff' }} />
          <span style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>Ruta activa sin reservas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#fbbf24', borderRadius: '50%', border: '1.5px solid #fff' }} />
          <span style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>Ruta con reservas</span>
        </div>
      </div>
    </div>
  );
}