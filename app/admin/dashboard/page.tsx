'use client';
import { useEffect, useState } from 'react';
import MapaRutas from '../../components/MapaRutas';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_usuarios: 0, total_vehiculos: 0, total_rutas: 0, viajes_completados: 0 });
  const [tab, setTab] = useState<'usuarios' | 'vehiculos' | 'rutas' | null>(null);
  const [datos, setDatos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<any>(null);
  const [creando, setCreando] = useState(false);
  const [formCrear, setFormCrear] = useState<any>({});
  const [formEditar, setFormEditar] = useState<any>({});

  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";

  useEffect(() => { cargarStats(); }, []);
  useEffect(() => { if (tab) { cargarDatos(tab); setEditando(null); setCreando(false); setFormCrear({}); } }, [tab]);

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
    if (!confirm(`Eliminar ${nombre}? Esta accion no se puede deshacer.`)) return;
    setMensaje(''); setError('');
    const res = await fetch(`/api/admin?tipo=${tipo}&id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) { setMensaje(data.mensaje); cargarStats(); if (tab) cargarDatos(tab); }
    else { setError(data.error); }
  };

  const handleEditar = (item: any) => {
    setEditando(item.id);
    setFormEditar({ ...item });
    setCreando(false);
  };

  const handleGuardarEdicion = async () => {
    setMensaje(''); setError('');
    const tipoSingular = tab === 'usuarios' ? 'usuario' : tab === 'vehiculos' ? 'vehiculo' : 'ruta';
    const res = await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: tipoSingular, id: editando, datos: formEditar }),
    });
    const data = await res.json();
    if (res.ok) { setMensaje(data.mensaje); setEditando(null); if (tab) cargarDatos(tab); cargarStats(); }
    else { setError(data.error); }
  };

  const handleCrear = async () => {
    setMensaje(''); setError('');
    const tipoSingular = tab === 'usuarios' ? 'usuario' : tab === 'vehiculos' ? 'vehiculo' : 'ruta';
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: tipoSingular, datos: formCrear }),
    });
    const data = await res.json();
    if (res.ok) { setMensaje(data.mensaje); setCreando(false); setFormCrear({}); if (tab) cargarDatos(tab); cargarStats(); }
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
  const inputStyle: React.CSSProperties = { background: '#FAFAF8', border: '0.5px solid #D6CCC2', borderRadius: '6px', padding: '7px 10px', fontSize: '12px', color: '#1a1a1a', outline: 'none', fontFamily: sans, width: '100%', boxSizing: 'border-box' };

  const formUsuario = (form: any, setForm: any) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Nombre</label><input style={inputStyle} value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Correo</label><input style={inputStyle} value={form.correo || ''} onChange={e => setForm({ ...form, correo: e.target.value })} /></div>
      {!editando && <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Contraseña</label><input type="password" style={inputStyle} value={form.contrasena || ''} onChange={e => setForm({ ...form, contrasena: e.target.value })} /></div>}
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Perfil</label>
        <select style={inputStyle} value={form.perfil || ''} onChange={e => setForm({ ...form, perfil: e.target.value })}>
          <option value="">Selecciona</option>
          <option value="pasajero">Pasajero</option>
          <option value="conductor">Conductor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Universidad</label><input style={inputStyle} value={form.universidad || ''} onChange={e => setForm({ ...form, universidad: e.target.value })} /></div>
    </div>
  );

  const formVehiculo = (form: any, setForm: any) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
      {creando && <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>ID Conductor</label><input style={inputStyle} value={form.conductor_id || ''} onChange={e => setForm({ ...form, conductor_id: e.target.value })} /></div>}
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Placa</label><input style={inputStyle} value={form.placa || ''} onChange={e => setForm({ ...form, placa: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Marca</label><input style={inputStyle} value={form.marca || ''} onChange={e => setForm({ ...form, marca: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Modelo</label><input style={inputStyle} value={form.modelo || ''} onChange={e => setForm({ ...form, modelo: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Color</label><input style={inputStyle} value={form.color || ''} onChange={e => setForm({ ...form, color: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Puestos</label><input type="number" min="1" max="8" style={inputStyle} value={form.puestos || ''} onChange={e => setForm({ ...form, puestos: e.target.value })} /></div>
    </div>
  );

  const formRuta = (form: any, setForm: any) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
      {creando && <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>ID Conductor</label><input style={inputStyle} value={form.conductor_id || ''} onChange={e => setForm({ ...form, conductor_id: e.target.value })} /></div>}
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Origen</label><input style={inputStyle} value={form.origen || ''} onChange={e => setForm({ ...form, origen: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Destino</label><input style={inputStyle} value={form.destino || ''} onChange={e => setForm({ ...form, destino: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Fecha</label><input type="date" style={inputStyle} value={form.fecha ? form.fecha.split('T')[0] : ''} onChange={e => setForm({ ...form, fecha: e.target.value })} /></div>
      <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Hora</label><input type="time" style={inputStyle} value={form.hora_salida || ''} onChange={e => setForm({ ...form, hora_salida: e.target.value })} /></div>
      {!creando && <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Estado</label>
        <select style={inputStyle} value={form.estado || ''} onChange={e => setForm({ ...form, estado: e.target.value })}>
          <option value="activa">Activa</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>}
      {creando && <div><label style={{ fontSize: '10px', color: '#9E9890', display: 'block', marginBottom: '4px', fontFamily: sans }}>Puestos</label><input type="number" min="1" max="8" style={inputStyle} value={form.puestos || ''} onChange={e => setForm({ ...form, puestos: e.target.value })} /></div>}
    </div>
  );

  return (
    <div style={{ background: '#EDEDE9', minHeight: '100vh', flex: 1, fontFamily: sans }}>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid-admin { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-section { padding: 32px 20px 40px !important; }
          .hero-title { font-size: 32px !important; }
          .dashboard-content { padding: 16px !important; }
          .navbar { padding: 0 16px !important; }
          .card { padding: 20px 16px !important; }
          .botones-admin { grid-template-columns: 1fr !important; }
          .tabla-wrapper { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
        }
      `}</style>

      <div className="navbar" style={{ background: '#1a1a1a', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff', fontFamily: sans }}>CARPODRIVE — Admin</span>
        <button onClick={() => { localStorage.removeItem('usuario'); window.location.href = '/login'; }}
          style={{ fontSize: '12px', color: '#9E9890', background: 'none', border: '0.5px solid #3a3a3a', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontFamily: sans }}>
          Cerrar sesion
        </button>
      </div>

      <div className="hero-section" style={{ background: '#1a1a1a', padding: '52px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '350px', height: '350px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', color: '#6b6b6b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: sans }}>Panel de administrador</p>
          <h1 className="hero-title" style={{ fontSize: '42px', fontWeight: 400, color: '#fff', marginBottom: '48px', lineHeight: 1.1, fontFamily: serif }}>
            Vista <em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>general</em>
          </h1>

          <div className="stats-grid-admin" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
            {[
              { label: 'Usuarios', value: stats.total_usuarios, key: 'usuarios' },
              { label: 'Vehiculos', value: stats.total_vehiculos, key: 'vehiculos' },
              { label: 'Rutas', value: stats.total_rutas, key: 'rutas' },
              { label: 'Viajes completados', value: stats.viajes_completados, key: null },
            ].map((stat, i) => (
              <div key={i}
                onClick={() => stat.key && setTab(stat.key as any)}
                style={{ background: tab === stat.key ? '#222' : '#111', padding: '24px 20px', cursor: stat.key ? 'pointer' : 'default', transition: 'background 0.15s' }}>
                <p style={{ fontSize: '10px', color: '#6b6b6b', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: sans }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 400, color: '#fff', lineHeight: 1, marginBottom: '8px', fontFamily: serif }}>{stat.value}</p>
                {stat.key && <p style={{ fontSize: '11px', color: '#4a4a4a', fontFamily: sans }}>Click para gestionar</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-content" style={{ padding: '32px 40px' }}>

        {mensaje && <div style={{ background: '#1a1a1a', color: '#D6CCC2', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>✓ {mensaje}</div>}
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>{error}</div>}

        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Mapa de todas las rutas activas</p>
          <MapaRutas tipo="admin" />
        </div>

        <div className="botones-admin" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'usuarios', label: 'Gestionar usuarios' },
            { key: 'vehiculos', label: 'Gestionar vehiculos' },
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

        {tab && (
          <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: sans }}>
                {tab === 'usuarios' ? 'Usuarios' : tab === 'vehiculos' ? 'Vehiculos' : 'Rutas'}
              </p>
              <button onClick={() => { setCreando(!creando); setEditando(null); setFormCrear({}); }}
                style={{ background: creando ? '#EDEDE9' : '#1a1a1a', color: creando ? '#1a1a1a' : '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                {creando ? 'Cancelar' : `+ Crear ${tab === 'usuarios' ? 'usuario' : tab === 'vehiculos' ? 'vehiculo' : 'ruta'}`}
              </button>
            </div>

            {creando && (
              <div style={{ background: '#FAFAF8', border: '0.5px solid #D6CCC2', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: sans }}>
                  Nuevo {tab === 'usuarios' ? 'usuario' : tab === 'vehiculos' ? 'vehiculo' : 'ruta'}
                </p>
                {tab === 'usuarios' && formUsuario(formCrear, setFormCrear)}
                {tab === 'vehiculos' && formVehiculo(formCrear, setFormCrear)}
                {tab === 'rutas' && formRuta(formCrear, setFormCrear)}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCrear}
                    style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                    Guardar
                  </button>
                  <button onClick={() => { setCreando(false); setFormCrear({}); }}
                    style={{ background: '#EDEDE9', color: '#1a1a1a', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {datos.length === 0 ? (
              <p style={{ color: '#9E9890', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontFamily: sans }}>No hay datos.</p>
            ) : (
              <div className="tabla-wrapper">
                {tab === 'usuarios' ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr><th style={th}>ID</th><th style={th}>Nombre</th><th style={th}>Correo</th><th style={th}>Perfil</th><th style={th}>Universidad</th><th style={th}>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {datos.map((u: any) => (
                        <>
                          <tr key={u.id}>
                            <td style={td}>{u.id}</td>
                            <td style={{ ...td, fontWeight: 500 }}>{u.nombre}</td>
                            <td style={{ ...td, color: '#9E9890' }}>{u.correo}</td>
                            <td style={td}>{badgePerfil(u.perfil)}</td>
                            <td style={td}>{u.universidad}</td>
                            <td style={td}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEditar(u)}
                                  style={{ background: '#EDEDE9', color: '#1a1a1a', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                  Editar
                                </button>
                                <button onClick={() => handleEliminar('usuario', u.id, u.nombre)}
                                  style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                          {editando === u.id && (
                            <tr key={`edit-${u.id}`}>
                              <td colSpan={6} style={{ padding: '16px 12px', background: '#FAFAF8', borderBottom: '0.5px solid #EDEDE9' }}>
                                {formUsuario(formEditar, setFormEditar)}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button onClick={handleGuardarEdicion}
                                    style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                    Guardar
                                  </button>
                                  <button onClick={() => setEditando(null)}
                                    style={{ background: '#EDEDE9', color: '#1a1a1a', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                    Cancelar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                ) : tab === 'vehiculos' ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr><th style={th}>ID</th><th style={th}>Conductor</th><th style={th}>Placa</th><th style={th}>Vehiculo</th><th style={th}>Color</th><th style={th}>Puestos</th><th style={th}>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {datos.map((v: any) => (
                        <>
                          <tr key={v.id}>
                            <td style={td}>{v.id}</td>
                            <td style={{ ...td, fontWeight: 500 }}>{v.conductor_nombre}</td>
                            <td style={{ ...td, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }}>{v.placa}</td>
                            <td style={td}>{v.marca} {v.modelo}</td>
                            <td style={td}>{v.color}</td>
                            <td style={td}>{v.puestos}</td>
                            <td style={td}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEditar(v)}
                                  style={{ background: '#EDEDE9', color: '#1a1a1a', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                  Editar
                                </button>
                                <button onClick={() => handleEliminar('vehiculo', v.id, v.placa)}
                                  style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                          {editando === v.id && (
                            <tr key={`edit-${v.id}`}>
                              <td colSpan={7} style={{ padding: '16px 12px', background: '#FAFAF8', borderBottom: '0.5px solid #EDEDE9' }}>
                                {formVehiculo(formEditar, setFormEditar)}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button onClick={handleGuardarEdicion}
                                    style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                    Guardar
                                  </button>
                                  <button onClick={() => setEditando(null)}
                                    style={{ background: '#EDEDE9', color: '#1a1a1a', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                    Cancelar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                      <tr><th style={th}>ID</th><th style={th}>Conductor</th><th style={th}>Origen</th><th style={th}>Destino</th><th style={th}>Hora</th><th style={th}>Estado</th><th style={th}>Reservas</th><th style={th}>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {datos.map((r: any) => (
                        <>
                          <tr key={r.id}>
                            <td style={td}>{r.id}</td>
                            <td style={{ ...td, fontWeight: 500 }}>{r.conductor_nombre}</td>
                            <td style={td}>{r.origen}</td>
                            <td style={td}>{r.destino}</td>
                            <td style={{ ...td, fontFamily: serif }}>{r.hora_salida}</td>
                            <td style={td}>{badgeEstado(r.estado)}</td>
                            <td style={td}>{r.total_reservas}</td>
                            <td style={td}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEditar(r)}
                                  style={{ background: '#EDEDE9', color: '#1a1a1a', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                  Editar
                                </button>
                                <button onClick={() => handleEliminar('ruta', r.id, `${r.origen}→${r.destino}`)}
                                  style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                          {editando === r.id && (
                            <tr key={`edit-${r.id}`}>
                              <td colSpan={8} style={{ padding: '16px 12px', background: '#FAFAF8', borderBottom: '0.5px solid #EDEDE9' }}>
                                {formRuta(formEditar, setFormEditar)}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button onClick={handleGuardarEdicion}
                                    style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                    Guardar
                                  </button>
                                  <button onClick={() => setEditando(null)}
                                    style={{ background: '#EDEDE9', color: '#1a1a1a', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                    Cancelar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}