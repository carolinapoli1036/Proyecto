'use client';
import { useEffect, useState } from 'react';

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

export default function MapaRutas({ tipo, usuario_id }: Props) {
  const [rutas, setRutas] = useState<RutaMapa[]>([]);
  const [mounted, setMounted] = useState(false);
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
    if (!mounted || rutas.length === 0) return;

    const L = require('leaflet');

    // Inyectar CSS de leaflet
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const contenedor = document.getElementById('mapa-carpoodrive');
    if (!contenedor) return;
    if ((contenedor as any)._leaflet_id) {
      (contenedor as any)._leaflet_id = null;
      contenedor.innerHTML = '';
    }

    const map = L.map('mapa-carpoodrive').setView([6.2442, -75.5812], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const iconOrigen = L.divIcon({
      html: `<div style="width:14px;height:14px;background:#D6CCC2;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    const iconOrigenReservado = L.divIcon({
      html: `<div style="width:14px;height:14px;background:#fbbf24;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    const iconDestino = L.divIcon({
      html: `<div style="width:12px;height:12px;background:#9E9890;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
      className: '',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    rutas.forEach(ruta => {
      const color = ruta.tiene_reservas ? '#fbbf24' : '#D6CCC2';
      const iconO = ruta.tiene_reservas ? iconOrigenReservado : iconOrigen;

      L.polyline([ruta.coord_origen, ruta.coord_destino], {
        color,
        weight: 2.5,
        opacity: 0.8,
        dashArray: ruta.tiene_reservas ? undefined : '6, 6',
      }).addTo(map);

      L.marker(ruta.coord_origen, { icon: iconO })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; min-width: 160px;">
            <strong style="color:#1a1a1a;">${ruta.origen}</strong><br/>
            <span style="color:#9E9890;">→ ${ruta.destino}</span><br/><br/>
            <span style="color:#1a1a1a;">Conductor: ${ruta.conductor_nombre}</span><br/>
            <span style="color:#1a1a1a;">Hora: ${ruta.hora_salida}</span><br/>
            <span style="color:#1a1a1a;">Puestos: ${ruta.puestos_disponibles}</span><br/>
            <span style="color:${ruta.tiene_reservas ? '#f59e0b' : '#9E9890'};">
              ${ruta.tiene_reservas ? `Con ${ruta.reservas_count} reserva(s)` : 'Sin reservas'}
            </span>
          </div>
        `);

      L.marker(ruta.coord_destino, { icon: iconDestino })
        .addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;font-size:12px;"><strong>Destino:</strong> ${ruta.destino}</div>`);
    });

    return () => { map.remove(); };
  }, [mounted, rutas]);

  if (!mounted) return null;

  return (
    <div style={{ width: '100%' }}>
      <div id="mapa-carpoodrive" style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }} />
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#D6CCC2', borderRadius: '50%', border: '1.5px solid #fff' }} />
          <span style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>Ruta activa sin reservas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', background: '#fbbf24', borderRadius: '50%', border: '1.5px solid #fff' }} />
          <span style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>Ruta con reservas</span>
        </div>
        <span style={{ fontSize: '11px', color: '#6b6b6b', fontFamily: sans }}>Clic en un punto para ver detalles</span>
      </div>
    </div>
  );
}