'use client';
import { useState } from 'react';

export default function RecuperarPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";

  const handleRecuperar = async () => {
    setError(''); setMensaje('');
    if (!correo || !contrasena || !confirmar) {
      setError('Por favor completa todos los campos'); return;
    }
    if (contrasena !== confirmar) {
      setError('Las contraseñas no coinciden'); return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres'); return;
    }
    setCargando(true);
    const res = await fetch('/api/usuarios/contrasena', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena_nueva: contrasena }),
    });
    const data = await res.json();
    setCargando(false);
    if (res.ok) {
      setMensaje('Contraseña actualizada. Redirigiendo...');
      setTimeout(() => window.location.href = '/login', 2000);
    } else {
      setError(data.error);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#fff', border: '0.5px solid #D6CCC2',
    borderRadius: '8px', padding: '12px 16px', fontSize: '13px',
    color: '#1a1a1a', outline: 'none', fontFamily: sans, boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', color: '#9E9890', display: 'block',
    marginBottom: '8px', fontFamily: sans, letterSpacing: '0.5px',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flex: 1, fontFamily: sans }}>

      {/* Panel izquierdo */}
      <div style={{ width: '45%', background: '#1a1a1a', padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)' }} />

        <div>
          <a href="/" style={{ fontSize: '15px', fontWeight: 500, color: '#fff', textDecoration: 'none', fontFamily: sans }}>CarPoolDrive</a>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', color: '#6b6b6b', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '24px', fontFamily: sans }}>Recuperar acceso</p>
          <h1 style={{ fontSize: '48px', fontWeight: 400, color: '#fff', lineHeight: 1.1, fontFamily: serif, marginBottom: '20px' }}>
            Nueva<br /><em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>contraseña</em>
          </h1>
          <p style={{ fontSize: '14px', color: '#6b6b6b', lineHeight: 1.7, fontFamily: sans, fontWeight: 300, maxWidth: '320px' }}>
            Ingresa tu correo registrado y elige una nueva contraseña para recuperar el acceso a tu cuenta.
          </p>
        </div>

        <div>
          <a href="/login" style={{ fontSize: '13px', color: '#9E9890', textDecoration: 'none', fontFamily: sans }}>
            Volver al inicio de sesion
          </a>
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1, background: '#EDEDE9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '32px', fontFamily: sans }}>Recuperar contraseña</p>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', marginBottom: '20px', fontFamily: sans }}>
              {error}
            </div>
          )}

          {mensaje && (
            <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', marginBottom: '20px', fontFamily: sans }}>
              {mensaje}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Correo electronico</label>
            <input type="email" placeholder="correo@universidad.edu.co" style={inputStyle}
              value={correo} onChange={e => setCorreo(e.target.value)} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Nueva contraseña</label>
            <input type="password" placeholder="••••••••" style={inputStyle}
              value={contrasena} onChange={e => setContrasena(e.target.value)} />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Confirmar contraseña</label>
            <input type="password" placeholder="••••••••" style={inputStyle}
              value={confirmar} onChange={e => setConfirmar(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRecuperar()} />
          </div>

          <button onClick={handleRecuperar} disabled={cargando}
            style={{ width: '100%', background: '#1a1a1a', color: '#EDEDE9', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: 500, cursor: cargando ? 'not-allowed' : 'pointer', fontFamily: sans, marginBottom: '20px', opacity: cargando ? 0.7 : 1 }}>
            {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>

          <p style={{ textAlign: 'center' as const, fontSize: '13px', color: '#9E9890', fontFamily: sans }}>
            Recordaste tu contraseña?{' '}
            <a href="/login" style={{ color: '#1a1a1a', fontWeight: 500, textDecoration: 'none' }}>Inicia sesion</a>
          </p>
        </div>
      </div>
    </div>
  );
}