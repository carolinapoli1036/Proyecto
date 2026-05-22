'use client';
import { useEffect, useState, useRef } from 'react';

interface Mensaje {
  id: number;
  reserva_id: number;
  remitente_id: number;
  remitente_nombre: string;
  mensaje: string;
  creado_en: string;
}

interface Props {
  reserva_id: number;
  usuario_id: number;
  usuario_nombre: string;
  conductor_nombre: string;
  ruta: string;
  onCerrar: () => void;
}

export default function Chat({ reserva_id, usuario_id, usuario_nombre, conductor_nombre, ruta, onCerrar }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sans = "'DM Sans', system-ui, sans-serif";
  const serif = "'DM Serif Display', Georgia, serif";

  useEffect(() => {
    cargarMensajes();
    const interval = setInterval(cargarMensajes, 3000);
    return () => clearInterval(interval);
  }, [reserva_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const cargarMensajes = async () => {
    const res = await fetch(`/api/chat?reserva_id=${reserva_id}`);
    const data = await res.json();
    if (Array.isArray(data)) setMensajes(data);
  };

  const handleEnviar = async () => {
    if (!texto.trim()) return;
    setEnviando(true);
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reserva_id, remitente_id: usuario_id, mensaje: texto }),
    });
    setTexto('');
    setEnviando(false);
    cargarMensajes();
  };

  const formatHora = (fecha: string) => {
  const d = new Date(fecha);
  return d.toLocaleTimeString('es-CO', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'America/Bogota'
  });
};
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px',
        height: '580px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>

        {/* Header */}
        <div style={{ background: '#1a1a1a', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: sans, marginBottom: '2px' }}>
              Chat con {conductor_nombre}
            </p>
            <p style={{ fontSize: '11px', color: '#6b6b6b', fontFamily: sans }}>{ruta}</p>
          </div>
          <button onClick={onCerrar}
            style={{ background: 'none', border: 'none', color: '#9E9890', cursor: 'pointer', fontSize: '20px', padding: '4px' }}>
            ×
          </button>
        </div>

        {/* Mensajes */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mensajes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: '13px', color: '#9E9890', fontFamily: sans }}>No hay mensajes aun.</p>
              <p style={{ fontSize: '12px', color: '#D6CCC2', fontFamily: sans, marginTop: '4px' }}>Inicia la conversacion</p>
            </div>
          )}
          {mensajes.map(m => {
            const esMio = m.remitente_id === usuario_id;
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: esMio ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: esMio ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: esMio ? '#1a1a1a' : '#EDEDE9',
                  color: esMio ? '#EDEDE9' : '#1a1a1a',
                }}>
                  {!esMio && (
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, fontWeight: 500 }}>
                      {m.remitente_nombre}
                    </p>
                  )}
                  <p style={{ fontSize: '13px', fontFamily: sans, lineHeight: 1.5 }}>{m.mensaje}</p>
                </div>
                <p style={{ fontSize: '10px', color: '#9E9890', marginTop: '4px', fontFamily: sans }}>{formatHora(m.creado_en)}</p>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 20px', borderTop: '0.5px solid #EDEDE9', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEnviar()}
            style={{
              flex: 1, background: '#FAFAF8', border: '0.5px solid #D6CCC2',
              borderRadius: '8px', padding: '10px 14px', fontSize: '13px',
              color: '#1a1a1a', outline: 'none', fontFamily: sans,
            }}
          />
          <button onClick={handleEnviar} disabled={enviando || !texto.trim()}
            style={{
              background: texto.trim() ? '#1a1a1a' : '#EDEDE9',
              color: texto.trim() ? '#fff' : '#9E9890',
              border: 'none', borderRadius: '8px', padding: '10px 20px',
              fontSize: '13px', cursor: texto.trim() ? 'pointer' : 'not-allowed',
              fontFamily: sans, whiteSpace: 'nowrap' as const,
            }}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}