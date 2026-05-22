'use client';
import { useEffect, useState } from 'react';

interface Notificacion {
  id: number;
  mensaje: string;
  leida: number;
  creado_en: string;
}

interface Props {
  usuario_id: number;
}

export default function Notificaciones({ usuario_id }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [abierto, setAbierto] = useState(false);
  const sans = "'DM Sans', system-ui, sans-serif";

  useEffect(() => {
    cargarNotificaciones();
    const interval = setInterval(cargarNotificaciones, 10000);
    return () => clearInterval(interval);
  }, [usuario_id]);

  const cargarNotificaciones = async () => {
    const res = await fetch(`/api/notificaciones?usuario_id=${usuario_id}`);
    const data = await res.json();
    if (Array.isArray(data)) setNotificaciones(data);
  };

  const handleAbrir = async () => {
    setAbierto(!abierto);
    if (!abierto) {
      await fetch('/api/notificaciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id }),
      });
      setTimeout(() => {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: 1 })));
      }, 1000);
    }
  };

  const noLeidas = notificaciones.filter(n => n.leida === 0).length;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleAbrir}
        style={{ background: 'none', border: '0.5px solid #3a3a3a', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer', color: '#9E9890', fontSize: '16px', position: 'relative' }}>
        🔔
        {noLeidas > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            width: '16px', height: '16px', fontSize: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: sans, fontWeight: 700,
          }}>
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <>
          <div onClick={() => setAbierto(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{
            position: 'absolute', top: '44px', right: 0,
            background: '#1a1a1a', border: '0.5px solid #3a3a3a',
            borderRadius: '12px', width: '300px', maxHeight: '400px',
            overflowY: 'auto', zIndex: 99,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #2e2e2e' }}>
              <p style={{ fontSize: '12px', color: '#9E9890', fontFamily: sans, letterSpacing: '1px', textTransform: 'uppercase' }}>Notificaciones</p>
            </div>
            {notificaciones.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#6b6b6b', fontFamily: sans }}>No tienes notificaciones</p>
              </div>
            ) : (
              notificaciones.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px', borderBottom: '0.5px solid #2e2e2e',
                  background: n.leida === 0 ? 'rgba(214,204,194,0.05)' : 'transparent',
                }}>
                  {n.leida === 0 && (
                    <div style={{ width: '6px', height: '6px', background: '#D6CCC2', borderRadius: '50%', marginBottom: '6px' }} />
                  )}
                  <p style={{ fontSize: '12px', color: '#D6CCC2', fontFamily: sans, lineHeight: 1.5 }}>{n.mensaje}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}