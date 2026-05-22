'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_usuarios: 0, total_vehiculos: 0, total_rutas: 0, viajes_completados: 0 });
  const [tab, setTab] = useState<'usuarios' | 'vehiculos' | 'rutas' | null>(null);
  const [datos, setDatos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";

  useEffect(() => { cargarStats(); }, []);
  useEffect(() => { if (tab) cargarDatos(tab); }, [tab]);

  const cargarStats = async () => {
    const res = await fetch('/api/admin?tipo=stats');
    const data = await res.json();
    if (!data.error) setStats(data);
  };

  const cargarDatos = async (tipo: string) => {
    const res = await fetch(`/api/admin?tipo=${tipo}`);
    const data = await res.json();
    if (Array.isArray(data)) setDatos(data);
  };

  const handleEliminar = async (tipo: string, id: number, nombre: string) => {
    if (!confirm(`¿Eliminar ${nombre}? Esta acción no se puede deshacer.`)) return;
    setMensaje(''); setError('');
    const res = await fetch(`/api/admin?tipo=${tipo}&id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) { setMensaje(data.mensaje); cargarStats(); if (tab) cargarDatos(tab); }
    else { setError(data.error); }
  };

  const badgePerfil = (perfil: string) => {
    const map: Record<string, React.CSSProperties> = {
      admin: { background: '#3a3a3a', color: '#D6CCC2' },
      conductor: { background: '#1e2e1e', color: '#86efac' },
      pasajero: { background: '#1e1e2e', color: '#a5b4fc' },
    };
    return <span style={{ ...map[perfil], fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontFamily: sans }}>{perfil}</span>;
  };

  const badgeEstado = (estado: string) => {
    const map: Record<string, React.CSSProperties> = {
      activa: { background: '#d1fae5', color: '#065f46' },
      completada: { background: '#1a1a1a', color: '#EDEDE9' },
      cancelada: { background: '#fee2e2', color: '#991b1b' },
    };
    return <span style={{ ...(map[estado] ?? map.cancelada), fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontFamily: sans }}>{estado}</span>;
  };

  const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: '10px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#9E9890', borderBottom: '0.5px solid #D6CCC2', fontFamily: sans };
  const td: React.CSSProperties = { padding: '13px 12px', color: '#1a1a1a', borderBottom: '0.5px solid #EDEDE9', fontSize: '13px', fontFamily: sans };

  return (
    <div style={{ background: '#EDEDE9', minHeight: '100vh', flex: 1, fontFamily: sans }}>

      {/* Navbar */}
      <div style={{ background: '#1a1a1a', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff', fontFamily: sans }}>CarPoolDrive — Admin</span>
        <button onClick={() => { localStorage.removeItem('usuario'); window.location.href = '/login'; }}
          style={{ fontSize: '12px', color: '#9E9890', background: 'none', border: '0.5px solid #3a3a3a', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontFamily: sans }}>
          Cerrar sesión
        </button>
      </div>

      {/* Hero */}
      <div style={{ background: '#1a1a1a', padding: '52px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '350px', height: '350px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', color: '#6b6b6b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: sans }}>Panel de administrador</p>
          <h1 style={{ fontSize: '42px', fontWeight: 400, color: '#fff', marginBottom: '48px', lineHeight: 1.1, fontFamily: serif }}>
            Vista <em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>general</em>
          </h1>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
            {[
              { label: 'Usuarios', value: stats.total_usuarios, key: 'usuarios' },
              { label: 'Vehículos', value: stats.total_vehiculos, key: 'vehiculos' },
              { label: 'Rutas', value: stats.total_rutas, key: 'rutas' },
              { label: 'Viajes completados', value: stats.viajes_completados, key: null },
            ].map((stat, i) => (
              <div key={i}
                onClick={() => stat.key && setTab(stat.key as any)}
                style={{ background: tab === stat.key ? '#222' : '#111', padding: '24px 28px', cursor: stat.key ? 'pointer' : 'default', transition: 'background 0.15s' }}>
                <p style={{ fontSize: '10px', color: '#6b6b6b', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: sans }}>{stat.label}</p>
                <p style={{ fontSize: '32px', fontWeight: 400, color: '#fff', lineHeight: 1, marginBottom: '8px', fontFamily: serif }}>{stat.value}</p>
                {stat.key && <p style={{ fontSize: '11px', color: '#4a4a4a', fontFamily: sans }}>Click para gestionar</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>

        {mensaje && <div style={{ background: '#1a1a1a', color: '#D6CCC2', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>✓ {mensaje}</div>}
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>{error}</div>}

        {/* Botones */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'usuarios', label: 'Gestionar usuarios' },
            { key: 'vehiculos', label: 'Gestionar vehículos' },
            { key: 'rutas', label: 'Gestionar rutas' },
          ].map(btn => (
            <button key={btn.key}
              onClick={() => setTab(btn.key as any)}
              style={{
                background: tab === btn.key ? '#1a1a1a' : '#fff',
                color: tab === btn.key ? '#EDEDE9' : '#1a1a1a',
                border: `0.5px solid ${tab === btn.key ? '#1a1a1a' : '#D6CCC2'}`,
                borderRadius: '10px', padding: '14px', fontSize: '13px',
                cursor: 'pointer', fontFamily: sans, fontWeight: 500,
                transition: 'all 0.15s',
              }}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Tabla */}
        {tab && (
          <div style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px' }}>
            <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>
              {tab === 'usuarios' ? 'Usuarios' : tab === 'vehiculos' ? 'Vehículos' : 'Rutas'}
            </p>

            {datos.length === 0 ? (
              <p style={{ color: '#9E9890', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontFamily: sans }}>No hay datos.</p>
            ) : tab === 'usuarios' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>ID</th><th style={th}>Nombre</th><th style={th}>Correo</th>
                    <th style={th}>Perfil</th><th style={th}>Universidad</th><th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((u: any) => (
                    <tr key={u.id}>
                      <td style={td}>{u.id}</td>
                      <td style={{ ...td, fontWeight: 500 }}>{u.nombre}</td>
                      <td style={{ ...td, color: '#9E9890' }}>{u.correo}</td>
                      <td style={td}>{badgePerfil(u.perfil)}</td>
                      <td style={td}>{u.universidad}</td>
                      <td style={td}>
                        <button onClick={() => handleEliminar('usuario', u.id, u.nombre)}
                          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : tab === 'vehiculos' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>ID</th><th style={th}>Conductor</th><th style={th}>Placa</th>
                    <th style={th}>Vehículo</th><th style={th}>Color</th><th style={th}>Puestos</th><th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((v: any) => (
                    <tr key={v.id}>
                      <td style={td}>{v.id}</td>
                      <td style={{ ...td, fontWeight: 500 }}>{v.conductor_nombre}</td>
                      <td style={{ ...td, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}>{v.placa}</td>
                      <td style={td}>{v.marca} {v.modelo}</td>
                      <td style={td}>{v.color}</td>
                      <td style={td}>{v.puestos}</td>
                      <td style={td}>
                        <button onClick={() => handleEliminar('vehiculo', v.id, v.placa)}
                          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>ID</th><th style={th}>Conductor</th><th style={th}>Origen</th>
                    <th style={th}>Destino</th><th style={th}>Hora</th><th style={th}>Estado</th>
                    <th style={th}>Reservas</th><th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((r: any) => (
                    <tr key={r.id}>
                      <td style={td}>{r.id}</td>
                      <td style={{ ...td, fontWeight: 500 }}>{r.conductor_nombre}</td>
                      <td style={td}>{r.origen}</td>
                      <td style={td}>{r.destino}</td>
                      <td style={{ ...td, fontFamily: serif }}>{r.hora_salida}</td>
                      <td style={td}>{badgeEstado(r.estado)}</td>
                      <td style={td}>{r.total_reservas}</td>
                      <td style={td}>
                        <button onClick={() => handleEliminar('ruta', r.id, `${r.origen}→${r.destino}`)}
                          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}