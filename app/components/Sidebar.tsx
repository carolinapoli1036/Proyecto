'use client';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [perfil, setPerfil] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string>('');
  const [abierto, setAbierto] = useState(false);

  const sans = "'DM Sans', system-ui, sans-serif";

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
    padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
    color: '#9E9890', textDecoration: 'none', cursor: 'pointer',
    fontFamily: sans, transition: 'background 0.15s',
  };

  const sidebarContent = (
    <>
      <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '24px', padding: '0 8px', fontFamily: sans }}>CarPoolDrive</div>

      {perfil ? (
        <>
          <div style={{ background: '#2e2e2e', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
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
              <a href="/admin/dashboard" style={linkStyle} onClick={() => setAbierto(false)}>Dashboard Admin</a>
            </>
          )}
          {perfil === 'conductor' && (
            <>
              <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#4a4a4a', padding: '8px 8px 4px', textTransform: 'uppercase', fontFamily: sans }}>Conductor</div>
              <a href="/driver/dashboard" style={linkStyle} onClick={() => setAbierto(false)}>Mi Dashboard</a>
            </>
          )}
          {perfil === 'pasajero' && (
            <>
              <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#4a4a4a', padding: '8px 8px 4px', textTransform: 'uppercase', fontFamily: sans }}>Pasajero</div>
              <a href="/passenger/dashboard" style={linkStyle} onClick={() => setAbierto(false)}>Mi Dashboard</a>
            </>
          )}

          <div style={{ marginTop: 'auto' }}>
            <button onClick={cerrarSesion} style={{ ...linkStyle, background: 'none', border: 'none', width: '100%', color: '#4a4a4a' }}>
              Cerrar sesion
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#4a4a4a', padding: '8px 8px 4px', textTransform: 'uppercase', fontFamily: sans }}>General</div>
          <a href="/" style={linkStyle} onClick={() => setAbierto(false)}>Inicio</a>
          <a href="/login" style={linkStyle} onClick={() => setAbierto(false)}>Iniciar sesion</a>
          <a href="/register" style={linkStyle} onClick={() => setAbierto(false)}>Registrarse</a>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Sidebar desktop */}
      <aside style={{
        background: '#1a1a1a', width: '240px', minHeight: '100vh',
        padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '4px',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}
        className="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Botón hamburguesa móvil */}
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          display: 'none',
          position: 'fixed', top: '12px', left: '12px', zIndex: 1000,
          background: '#1a1a1a', border: 'none', borderRadius: '8px',
          padding: '8px 12px', cursor: 'pointer', color: '#fff', fontSize: '18px',
        }}
        className="sidebar-hamburger">
        {abierto ? '✕' : '☰'}
      </button>

      {/* Overlay móvil */}
      {abierto && (
        <div
          onClick={() => setAbierto(false)}
          style={{
            display: 'none',
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar móvil */}
      <aside
        style={{
          display: 'none',
          position: 'fixed', top: 0, left: abierto ? 0 : '-280px',
          width: '260px', height: '100vh', background: '#1a1a1a',
          padding: '60px 16px 28px', zIndex: 999,
          flexDirection: 'column', gap: '4px',
          transition: 'left 0.25s ease', overflowY: 'auto',
        }}
        className="sidebar-mobile">
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-hamburger { display: block !important; }
          .sidebar-overlay { display: block !important; }
          .sidebar-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}