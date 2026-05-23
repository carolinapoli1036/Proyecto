'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";

  const handleLogin = async () => {
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      if (data.usuario.perfil === 'admin') window.location.href = '/admin/dashboard';
      else if (data.usuario.perfil === 'conductor') window.location.href = '/driver/dashboard';
      else window.location.href = '/passenger/dashboard';
    } else {
      setError(data.error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flex: 1, fontFamily: sans }}>

      <div style={{ width: '45%', background: '#1a1a1a', padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '220px', height: '220px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.07)' }} />

        <div>
          <a href="/" style={{ fontSize: '15px', fontWeight: 500, color: '#fff', textDecoration: 'none', fontFamily: sans }}>CARPODRIVE</a>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', color: '#6b6b6b', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '24px', fontFamily: sans }}>Bienvenido de vuelta</p>
          <h1 style={{ fontSize: '48px', fontWeight: 400, color: '#fff', lineHeight: 1.1, fontFamily: serif, marginBottom: '20px' }}>
            Continua tu<br /><em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>camino</em>
          </h1>
          <p style={{ fontSize: '14px', color: '#6b6b6b', lineHeight: 1.7, fontFamily: sans, fontWeight: 300, maxWidth: '320px' }}>
            Inicia sesion para acceder a tus rutas, reservas y puntos acumulados.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {[{ v: '100+', l: 'Estudiantes' }, { v: '16+', l: 'Universidades' }, { v: '10pts', l: 'Por viaje' }].map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: '20px', fontWeight: 400, color: '#fff', fontFamily: serif, marginBottom: '4px' }}>{s.v}</p>
              <p style={{ fontSize: '11px', color: '#6b6b6b', fontFamily: sans }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, background: '#EDEDE9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '32px', fontFamily: sans }}>Iniciar sesion</p>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', marginBottom: '20px', fontFamily: sans }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Correo electronico</label>
            <input type="email" placeholder="correo@universidad.edu.co"
              value={correo} onChange={e => setCorreo(e.target.value)}
              style={{ width: '100%', background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#1a1a1a', outline: 'none', fontFamily: sans, boxSizing: 'border-box' as const }} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Contraseña</label>
            <input type="password" placeholder="••••••••"
              value={contrasena} onChange={e => setContrasena(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#1a1a1a', outline: 'none', fontFamily: sans, boxSizing: 'border-box' as const }} />
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'right' as const }}>
            <a href="/recuperar" style={{ fontSize: '12px', color: '#9E9890', textDecoration: 'none', fontFamily: sans }}>
              Olvidaste tu contraseña?
            </a>
          </div>

          <button onClick={handleLogin}
            style={{ width: '100%', background: '#1a1a1a', color: '#EDEDE9', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: sans, marginBottom: '20px' }}>
            Entrar
          </button>

          <p style={{ textAlign: 'center' as const, fontSize: '13px', color: '#9E9890', fontFamily: sans }}>
            No tienes cuenta?{' '}
            <a href="/register" style={{ color: '#1a1a1a', fontWeight: 500, textDecoration: 'none' }}>Registrate</a>
          </p>
        </div>
      </div>
    </div>
  );
}