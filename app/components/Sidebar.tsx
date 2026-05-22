'use client';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [perfil, setPerfil] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>('');

  const sans = "'DM Sans', system-ui, sans-serif";
  const serif = "'DM Serif Display', Georgia, serif";

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) {
      const user = JSON.parse(data);
      setPerfil(user.perfil);
      setNombre(user.nombre);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const linkStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 12px', borderRadius: '8px', fontSize: '13px',
    color: '#9E9890', textDecoration: 'none', cursor: 'pointer',
    fontFamily: sans,
  };

  if (!perfil) {
    return (
      <aside style={{ background: '#1a1a1a', width: '240px', minHeight: '100vh', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '32px', padding: '0 8px', fontFamily: sans }}>CarPoolDrive</div>
        <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#4a4a4a', padding: '8px 8px 4px', textTransform: 'uppercase', fontFamily: sans }}>General</div>
        <a href="/" style={linkStyle}>Inicio</a>
        <a href="/login" style={linkStyle}>Iniciar sesión</a>
        <a href="/register" style={linkStyle}>Registrarse</a>
      </aside>
    );
  }

  return (
    <aside style={{ background: '#1a1a1a', width: '240px', minHeight: '100vh', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '24px', padding: '0 8px', fontFamily: sans }}>CarPoolDrive</div>

      {/* Info usuario */}
      <div style={{ background: '#2e2e2e', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '6px', fontFamily: sans }}>{nombre}</div>
        <span style={{
          fontSize: '10px', padding: '3px 10px', borderRadius: '20px',
          display: 'inline-block', fontFamily: sans, letterSpacing: '0.5px',
          background: perfil === 'admin' ? '#3a3a3a' : perfil === 'conductor' ? '#1e2e1e' : '#1e1e2e',
          color: perfil === 'admin' ? '#D6CCC2' : perfil === 'conductor' ? '#86efac' : '#a5b4fc',
        }}>
          {perfil === 'admin' ? 'Admin' : perfil === 'conductor' ? 'Conductor' : 'Pasajero'}
        </span>
      </div>

      {perfil === 'admin' && (
        <>
          <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#4a4a4a', padding: '8px 8px 4px', textTransform: 'uppercase', fontFamily: sans }}>Administrador</div>
          <a href="/admin/dashboard" style={linkStyle}>Dashboard Admin</a>
        </>
      )}

      {perfil === 'conductor' && (
        <>
          <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#4a4a4a', padding: '8px 8px 4px', textTransform: 'uppercase', fontFamily: sans }}>Conductor</div>
          <a href="/driver/dashboard" style={linkStyle}>Mi Dashboard</a>
        </>
      )}

      {perfil === 'pasajero' && (
        <>
          <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#4a4a4a', padding: '8px 8px 4px', textTransform: 'uppercase', fontFamily: sans }}>Pasajero</div>
          <a href="/passenger/dashboard" style={linkStyle}>Mi Dashboard</a>
        </>
      )}

      <div style={{ marginTop: 'auto' }}>
        <button onClick={cerrarSesion} style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', color: '#4a4a4a' }}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}