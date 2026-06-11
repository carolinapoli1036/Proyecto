'use client';
import { useEffect, useState } from 'react';
import MapaRutas from '../../components/MapaRutas';
import Chat from '../../components/Chat';
import Notificaciones from '../../components/Notificaciones';

export default function DriverDashboard() {
  const [usuario, setUsuario] = useState<any>(null);
  const [rutas, setRutas] = useState<any[]>([]);
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [mensajeVehiculo, setMensajeVehiculo] = useState('');
  const [errorVehiculo, setErrorVehiculo] = useState('');
  const [mostrarFormVehiculo, setMostrarFormVehiculo] = useState(false);
  const [reservasPorRuta, setReservasPorRuta] = useState<Record<number, any[]>>({});
  const [rutaExpandida, setRutaExpandida] = useState<number | null>(null);
  const [chatReserva, setChatReserva] = useState<any>(null);
  const [puntos, setPuntos] = useState(0);
  const [rutasDisponibles, setRutasDisponibles] = useState<any[]>([]);
  const [filtro, setFiltro] = useState({ origen: '', destino: '' });
  const [misReservasComoP, setMisReservasComoP] = useState<any[]>([]);

  const [formRuta, setFormRuta] = useState({
    tipo_origen: '', origen: '', destino: '', hora_salida: '', puestos: 4, fecha: '', punto_encuentro: '',
  });

  const [formVehiculo, setFormVehiculo] = useState({
    placa: '', marca: '', modelo: '', color: '', puestos: 4,
  });

  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";
  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) {
      const user = JSON.parse(data);
      setUsuario(user);
      expirarRutas();
      cargarRutas(user.id);
      cargarVehiculo(user.id);
      cargarPuntos(user.id);
      cargarRutasDisponibles();
      cargarReservasComoP(user.id);
    }
  }, []);

  const expirarRutas = async () => {
    await fetch('/api/rutas/expirar', { method: 'POST' });
  };

  const cargarPuntos = async (usuario_id: number) => {
    const res = await fetch(`/api/usuarios/puntos?usuario_id=${usuario_id}`);
    const data = await res.json();
    if (data.puntos !== undefined) setPuntos(data.puntos);
  };

  const cargarRutasDisponibles = async (origen = '', destino = '') => {
    const params = new URLSearchParams();
    if (origen) params.append('origen', origen);
    if (destino) params.append('destino', destino);
    const res = await fetch(`/api/rutas/disponibles?${params}`);
    const data = await res.json();
    if (Array.isArray(data)) setRutasDisponibles(data);
  };

  const cargarReservasComoP = async (pasajero_id: number) => {
    const res = await fetch(`/api/reservas?pasajero_id=${pasajero_id}`);
    const data = await res.json();
    if (Array.isArray(data)) setMisReservasComoP(data);
  };

  const cargarRutas = async (conductor_id: number) => {
    const res = await fetch(`/api/rutas/conductor?conductor_id=${conductor_id}`);
    const data = await res.json();
    if (Array.isArray(data)) setRutas(data);
  };

  const cargarVehiculo = async (conductor_id: number) => {
    const res = await fetch(`/api/vehiculos?conductor_id=${conductor_id}`);
    const data = await res.json();
    setVehiculo(data);
  };

  const cargarReservasDeRuta = async (ruta_id: number) => {
    const res = await fetch(`/api/reservas/ruta?ruta_id=${ruta_id}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setReservasPorRuta(prev => ({ ...prev, [ruta_id]: data }));
    }
  };

  const handleExpandirRuta = (ruta_id: number) => {
    if (rutaExpandida === ruta_id) {
      setRutaExpandida(null);
    } else {
      setRutaExpandida(ruta_id);
      cargarReservasDeRuta(ruta_id);
    }
  };

  const handlePublicar = async () => {
    setMensaje(''); setError('');
    if (!formRuta.origen || !formRuta.destino || !formRuta.hora_salida || !formRuta.fecha) {
      setError('Por favor completa todos los campos incluyendo la fecha'); return;
    }
    const res = await fetch('/api/rutas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formRuta, conductor_id: usuario.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setMensaje('Ruta publicada exitosamente');
      cargarRutas(usuario.id);
      setFormRuta({ tipo_origen: '', origen: '', destino: '', hora_salida: '', puestos: 4, fecha: '', punto_encuentro: '' });
    } else { setError(data.error); }
  };

  const handleRegistrarVehiculo = async () => {
    setMensajeVehiculo(''); setErrorVehiculo('');
    if (!formVehiculo.placa || !formVehiculo.marca || !formVehiculo.modelo) {
      setErrorVehiculo('Completa placa, marca y modelo'); return;
    }
    const res = await fetch('/api/vehiculos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formVehiculo, conductor_id: usuario.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setMensajeVehiculo('Vehiculo registrado');
      cargarVehiculo(usuario.id);
      setMostrarFormVehiculo(false);
    } else { setErrorVehiculo(data.error); }
  };

  const handleCompletarRuta = async (ruta_id: number) => {
    if (!confirm('Marcar esta ruta como completada?')) return;
    setMensaje(''); setError('');
    const res = await fetch('/api/rutas/conductor', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruta_id, estado: 'completada' }),
    });
    const data = await res.json();
    if (res.ok) { setMensaje('Ruta completada'); cargarRutas(usuario.id); }
    else { setError(data.error ?? 'Error al completar'); }
  };

  const handleReservar = async (ruta_id: number) => {
    setMensaje(''); setError('');
    const res = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruta_id, pasajero_id: usuario.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setMensaje('Reserva realizada exitosamente');
      cargarRutasDisponibles();
      cargarReservasComoP(usuario.id);
    } else { setError(data.error); }
  };

  const handleUsarViajeGratis = async (ruta_id: number) => {
    setMensaje(''); setError('');
    const res = await fetch('/api/reservas/gratis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruta_id, pasajero_id: usuario.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setPuntos(data.puntos_restantes);
      setMensaje('Viaje gratis aplicado exitosamente.');
      cargarRutasDisponibles();
      cargarReservasComoP(usuario.id);
    } else { setError(data.error); }
  };

  const handleSeleccionarTipo = async (tipo: string) => {
    await fetch('/api/usuarios/tipo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: usuario.id, tipo_conductor: tipo }),
    });
    const updated = { ...usuario, tipo_conductor: tipo };
    localStorage.setItem('usuario', JSON.stringify(updated));
    setUsuario(updated);
  };

  const formatFecha = (fecha: string) => {
    if (!fecha) return '—';
    const partes = fecha.split('T')[0].split('-');
    const d = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const rutasCompletadas = rutas.filter(r => r.estado === 'completada').length;
  const pasajerosActivos = rutas.filter(r => r.estado === 'activa').reduce((acc: number, r: any) => acc + (r.puestos_totales - r.puestos_disponibles), 0);
  const nivel = rutasCompletadas >= 10 ? 'Elite' : rutasCompletadas >= 5 ? 'Destacado' : 'Nuevo';
  const viajesGratisDisponibles = Math.floor(puntos / 70);

  const inputStyle: React.CSSProperties = { background: '#FAFAF8', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1a1a1a', width: '100%', outline: 'none', fontFamily: sans, boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '6px', fontFamily: sans, letterSpacing: '0.5px' };
  const selectStyle: React.CSSProperties = { background: '#FAFAF8', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1a1a1a', width: '100%', outline: 'none', fontFamily: sans };

  const badgeEstado = (estado: string) => {
    const map: Record<string, React.CSSProperties> = {
      activa: { background: '#d1fae5', color: '#065f46' },
      completada: { background: '#1a1a1a', color: '#EDEDE9' },
      cancelada: { background: '#fee2e2', color: '#991b1b' },
    };
    return <span style={{ ...map[estado], fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500, fontFamily: sans }}>{estado}</span>;
  };

  const origenSelect = (
    <>
      <option value="">Selecciona el origen</option>
      <optgroup label="Estaciones Metro">
        {['Caribe','Universidad','El Poblado','San Antonio','Niquía','Acevedo','Industriales','Aguacatala','Ayurá','Envigado','Itagüí','La Estrella','Sabaneta'].map(e => (
          <option key={e} value={`Estación ${e}`}>{e}</option>
        ))}
      </optgroup>
      <optgroup label="Comunas">
        {['1 - Popular','2 - Santa Cruz','3 - Manrique','4 - Aranjuez','5 - Castilla','6 - Doce de Octubre','7 - Robledo','8 - Villa Hermosa','9 - Buenos Aires','10 - La Candelaria','11 - Laureles','12 - La América','13 - San Javier','14 - El Poblado','15 - Guayabal','16 - Belén'].map(c => (
          <option key={c} value={`Comuna ${c}`}>Comuna {c}</option>
        ))}
      </optgroup>
      <optgroup label="Municipios">
        {['Bello','Itagüí','Envigado','Sabaneta','La Estrella','Caldas'].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </optgroup>
      <optgroup label="Universidades">
        <option value="Universidad de Antioquia">U. de Antioquia</option>
        <option value="Universidad Nacional de Colombia">U. Nacional</option>
        <option value="Universidad EAFIT">EAFIT</option>
        <option value="Universidad Pontificia Bolivariana">UPB</option>
        <option value="Universidad de Medellín">U. de Medellín</option>
        <option value="Universidad CES">CES</option>
        <option value="Universidad Cooperativa de Colombia">U. Cooperativa</option>
        <option value="Universidad Autónoma Latinoamericana">UNAULA</option>
        <option value="Universidad Remington">U. Remington</option>
        <option value="Universidad San Buenaventura">U. San Buenaventura</option>
        <option value="Politécnico Colombiano Jaime Isaza Cadavid">Politécnico Colombiano</option>
        <option value="Instituto Tecnológico Metropolitano">ITM</option>
        <option value="Institución Universitaria Pascual Bravo">Pascual Bravo</option>
        <option value="Institución Universitaria Colegio Mayor">Colegio Mayor</option>
        <option value="Tecnológico de Antioquia">Tecnológico de Antioquia</option>
        <option value="SENA Regional Antioquia">SENA</option>
      </optgroup>
    </>
  );

  const destinoSelect = (
    <>
      <option value="">Selecciona el destino</option>
      <optgroup label="Universidades">
        <option value="Universidad de Antioquia">U. de Antioquia</option>
        <option value="Universidad Nacional de Colombia">U. Nacional</option>
        <option value="Universidad EAFIT">EAFIT</option>
        <option value="Universidad Pontificia Bolivariana">UPB</option>
        <option value="Universidad de Medellín">U. de Medellín</option>
        <option value="Universidad CES">CES</option>
        <option value="Universidad Cooperativa de Colombia">U. Cooperativa</option>
        <option value="Universidad Autónoma Latinoamericana">UNAULA</option>
        <option value="Universidad Remington">U. Remington</option>
        <option value="Universidad San Buenaventura">U. San Buenaventura</option>
        <option value="Politécnico Colombiano Jaime Isaza Cadavid">Politécnico Colombiano</option>
        <option value="Instituto Tecnológico Metropolitano">ITM</option>
        <option value="Institución Universitaria Pascual Bravo">Pascual Bravo</option>
        <option value="Institución Universitaria Colegio Mayor">Colegio Mayor</option>
        <option value="Tecnológico de Antioquia">Tecnológico de Antioquia</option>
        <option value="SENA Regional Antioquia">SENA</option>
      </optgroup>
      <optgroup label="Estaciones Metro">
        {['Caribe','Universidad','El Poblado','San Antonio','Niquía','Acevedo','Industriales','Aguacatala','Ayurá','Envigado','Itagüí','La Estrella','Sabaneta'].map(e => (
          <option key={e} value={`Estación ${e}`}>{e}</option>
        ))}
      </optgroup>
      <optgroup label="Comunas">
        {['1 - Popular','2 - Santa Cruz','3 - Manrique','4 - Aranjuez','5 - Castilla','6 - Doce de Octubre','7 - Robledo','8 - Villa Hermosa','9 - Buenos Aires','10 - La Candelaria','11 - Laureles','12 - La América','13 - San Javier','14 - El Poblado','15 - Guayabal','16 - Belén'].map(c => (
          <option key={c} value={`Comuna ${c}`}>Comuna {c}</option>
        ))}
      </optgroup>
    </>
  );

  const origenOptions = origenSelect;
  const destinoOptions = destinoSelect;

  return (
    <div style={{ background: '#EDEDE9', minHeight: '100vh', flex: 1, fontFamily: sans }}>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid-5 { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-section { padding: 32px 20px 40px !important; }
          .hero-title { font-size: 32px !important; }
          .dashboard-content { padding: 16px !important; }
          .navbar { padding: 0 16px !important; }
          .card { padding: 20px 16px !important; }
          .vehiculo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .form-ruta-grid { grid-template-columns: 1fr 1fr !important; }
          .ruta-row { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .badges-row { flex-wrap: wrap !important; gap: 8px !important; }
        }
      `}</style>

      {chatReserva && usuario && (
        <Chat
          reserva_id={chatReserva.id}
          usuario_id={usuario.id}
          usuario_nombre={usuario.nombre}
          conductor_nombre={chatReserva.pasajero_nombre}
          ruta={`${chatReserva.origen} → ${chatReserva.destino}`}
          estadoReserva={chatReserva.estado}
          onCerrar={() => setChatReserva(null)}
        />
      )}

      <div className="navbar" style={{ background: '#1a1a1a', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff', fontFamily: sans }}>CARPODRIVE — Conductor</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {usuario?.id && <Notificaciones usuario_id={usuario.id} />}
          <button onClick={() => { localStorage.removeItem('usuario'); window.location.href = '/login'; }}
            style={{ fontSize: '12px', color: '#9E9890', background: 'none', border: '0.5px solid #3a3a3a', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', fontFamily: sans }}>
            Cerrar sesion
          </button>
        </div>
      </div>

      <div className="hero-section" style={{ background: '#1a1a1a', padding: '52px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '350px', height: '350px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', color: '#6b6b6b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: sans }}>Panel de conductor</p>
          <h1 className="hero-title" style={{ fontSize: '42px', fontWeight: 400, color: '#fff', marginBottom: '16px', lineHeight: 1.1, fontFamily: serif }}>
            Hola, <em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>{usuario?.nombre?.split(' ')[0] ?? '...'}</em>
          </h1>

          {!usuario?.tipo_conductor && (
            <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: '#9E9890', fontFamily: sans, marginBottom: '12px' }}>Completa tu perfil — selecciona tu tipo:</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[{ v: 'estudiante', l: 'Estudiante' }, { v: 'docente', l: 'Docente' }].map(op => (
                  <button key={op.v} onClick={() => handleSeleccionarTipo(op.v)}
                    style={{ background: '#2e2e2e', color: '#D6CCC2', border: '0.5px solid #3a3a3a', borderRadius: '8px', padding: '8px 24px', fontSize: '13px', cursor: 'pointer', fontFamily: sans }}>
                    {op.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="badges-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {vehiculo && <span style={{ fontSize: '12px', color: '#6b6b6b', fontFamily: sans }}>{vehiculo.marca} {vehiculo.modelo} · {vehiculo.placa}</span>}
            {usuario?.tipo_conductor && (
              <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontFamily: sans, fontWeight: 500, background: usuario.tipo_conductor === 'docente' ? '#2e2a1a' : '#1e2a1e', color: usuario.tipo_conductor === 'docente' ? '#fcd34d' : '#86efac', border: `0.5px solid ${usuario.tipo_conductor === 'docente' ? '#fcd34d40' : '#86efac40'}` }}>
                {usuario.tipo_conductor === 'docente' ? 'Docente' : 'Estudiante'}
              </span>
            )}
            {rutasCompletadas >= 5 && (
              <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontFamily: sans, fontWeight: 500, background: '#2a1a2e', color: '#c4b5fd', border: '0.5px solid #c4b5fd40' }}>Conductor Destacado</span>
            )}
            {rutasCompletadas >= 10 && (
              <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontFamily: sans, fontWeight: 500, background: '#2a1a0e', color: '#fbbf24', border: '0.5px solid #fbbf2440' }}>Conductor Elite</span>
            )}
          </div>

          <div className="stats-grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
            {[
              { label: 'Mis rutas', value: String(rutas.length) },
              { label: 'Pasajeros activos', value: String(pasajerosActivos) },
              { label: 'Rutas completadas', value: String(rutasCompletadas) },
              { label: 'Mis puntos', value: String(puntos) },
              { label: 'Nivel', value: nivel },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#111', padding: '20px 16px' }}>
                <p style={{ fontSize: '10px', color: '#6b6b6b', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: sans }}>{stat.label}</p>
                <p style={{ fontSize: '22px', fontWeight: 400, color: stat.label === 'Nivel' ? (nivel === 'Elite' ? '#fbbf24' : nivel === 'Destacado' ? '#c4b5fd' : '#fff') : '#fff', lineHeight: 1, fontFamily: serif }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {viajesGratisDisponibles > 0 && (
            <div style={{ marginTop: '16px', background: 'rgba(214,204,194,0.1)', border: '0.5px solid rgba(214,204,194,0.3)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#D6CCC2', fontFamily: sans, marginBottom: '4px' }}>
                  Tienes {viajesGratisDisponibles} viaje{viajesGratisDisponibles > 1 ? 's' : ''} gratis disponible{viajesGratisDisponibles > 1 ? 's' : ''}
                </p>
                <p style={{ fontSize: '12px', color: '#6b6b6b', fontFamily: sans }}>Úsalos en la sección "Buscar ruta como pasajero"</p>
              </div>
              <div style={{ background: '#D6CCC2', color: '#1a1a1a', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, fontFamily: sans }}>
                {viajesGratisDisponibles} disponible{viajesGratisDisponibles > 1 ? 's' : ''}
              </div>
            </div>
          )}

          {viajesGratisDisponibles === 0 && (
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: '#6b6b6b', fontFamily: sans }}>Progreso hacia viaje gratis</p>
                <p style={{ fontSize: '12px', color: '#9E9890', fontFamily: sans }}>{puntos % 70}/70 pts</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#D6CCC2', height: '100%', width: `${((puntos % 70) / 70) * 100}%`, borderRadius: '4px', transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          {rutasCompletadas < 5 && (
            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 20px' }}>
              <p style={{ fontSize: '13px', color: '#6b6b6b', fontFamily: sans }}>Completa {5 - rutasCompletadas} rutas mas para convertirte en Conductor Destacado.</p>
            </div>
          )}
          {rutasCompletadas >= 5 && rutasCompletadas < 10 && (
            <div style={{ marginTop: '16px', background: 'rgba(196,181,253,0.1)', border: '0.5px solid #c4b5fd40', borderRadius: '10px', padding: '12px 20px' }}>
              <p style={{ fontSize: '13px', color: '#c4b5fd', fontFamily: sans }}>Eres Conductor Destacado. Completa {10 - rutasCompletadas} rutas mas para alcanzar nivel Elite.</p>
            </div>
          )}
          {rutasCompletadas >= 10 && (
            <div style={{ marginTop: '16px', background: 'rgba(214,204,194,0.1)', border: '0.5px solid rgba(214,204,194,0.3)', borderRadius: '10px', padding: '12px 20px' }}>
              <p style={{ fontSize: '13px', color: '#D6CCC2', fontFamily: sans }}>Eres Conductor Elite. Gracias por ser parte de la comunidad CARPODRIVE.</p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-content" style={{ padding: '32px 40px' }}>
        {mensaje && <div style={{ background: '#1a1a1a', color: '#D6CCC2', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>Listo: {mensaje}</div>}
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>{error}</div>}

        {/* Vehiculo */}
        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: vehiculo || mostrarFormVehiculo ? '20px' : '0' }}>
            <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: sans }}>Mi vehiculo</p>
            {!vehiculo && (
              <button onClick={() => setMostrarFormVehiculo(!mostrarFormVehiculo)}
                style={{ fontSize: '12px', color: '#1a1a1a', background: '#EDEDE9', border: 'none', borderRadius: '6px', padding: '7px 14px', cursor: 'pointer', fontFamily: sans }}>
                {mostrarFormVehiculo ? 'Cancelar' : '+ Registrar vehiculo'}
              </button>
            )}
          </div>
          {vehiculo && (
            <div className="vehiculo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[{ l: 'Placa', v: vehiculo.placa }, { l: 'Vehiculo', v: `${vehiculo.marca} ${vehiculo.modelo}` }, { l: 'Color', v: vehiculo.color }, { l: 'Puestos', v: vehiculo.puestos }].map((item, i) => (
                <div key={i} style={{ background: '#FAFAF8', border: '0.5px solid #EDEDE9', borderRadius: '10px', padding: '16px' }}>
                  <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '6px', fontFamily: sans, letterSpacing: '1px', textTransform: 'uppercase' }}>{item.l}</p>
                  <p style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, fontFamily: sans }}>{item.v}</p>
                </div>
              ))}
            </div>
          )}
          {mostrarFormVehiculo && !vehiculo && (
            <>
              {mensajeVehiculo && <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', marginBottom: '16px', fontFamily: sans }}>{mensajeVehiculo}</div>}
              {errorVehiculo && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', marginBottom: '16px', fontFamily: sans }}>{errorVehiculo}</div>}
              <div className="form-ruta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: '16px', alignItems: 'flex-end' }}>
                {[{ label: 'Placa', placeholder: 'ABC-123', key: 'placa' }, { label: 'Marca', placeholder: 'Mazda', key: 'marca' }, { label: 'Modelo', placeholder: '2020', key: 'modelo' }, { label: 'Color', placeholder: 'Rojo', key: 'color' }].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type="text" placeholder={f.placeholder} style={inputStyle} value={(formVehiculo as any)[f.key]} onChange={e => setFormVehiculo({ ...formVehiculo, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Puestos</label>
                  <input type="number" min="1" max="4" style={{ ...inputStyle, width: '70px' }} value={formVehiculo.puestos} onChange={e => setFormVehiculo({ ...formVehiculo, puestos: parseInt(e.target.value) })} />
                </div>
                <button onClick={handleRegistrarVehiculo} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' }}>Guardar</button>
              </div>
            </>
          )}
        </div>

        {/* Publicar ruta */}
        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Publicar nueva ruta</p>
          <div className="form-ruta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto auto', gap: '16px', alignItems: 'flex-end', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Origen</label>
              <select style={inputStyle} value={formRuta.origen} onChange={e => setFormRuta({ ...formRuta, origen: e.target.value })}>
                {origenSelect}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Destino</label>
              <select style={inputStyle} value={formRuta.destino} onChange={e => setFormRuta({ ...formRuta, destino: e.target.value })}>
                {destinoSelect}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fecha</label>
              <input type="date" style={inputStyle} value={formRuta.fecha} min={hoy}
                onChange={e => setFormRuta({ ...formRuta, fecha: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Hora</label>
              <input type="time" style={{ ...inputStyle, width: 'auto' }} value={formRuta.hora_salida}
                onChange={e => setFormRuta({ ...formRuta, hora_salida: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Puestos</label>
              <input type="number" min="1" max="4" style={{ ...inputStyle, width: '70px' }} value={formRuta.puestos}
                onChange={e => setFormRuta({ ...formRuta, puestos: parseInt(e.target.value) })} />
            </div>
            <button onClick={handlePublicar} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' }}>Publicar</button>
          </div>
          <div>
            <label style={labelStyle}>Punto de encuentro (opcional)</label>
            <input type="text" placeholder="Ej: Parque de Belén, Entrada principal del metro Itagüí..." style={inputStyle} value={formRuta.punto_encuentro}
              onChange={e => setFormRuta({ ...formRuta, punto_encuentro: e.target.value })} />
            <p style={{ fontSize: '11px', color: '#9E9890', marginTop: '6px', fontFamily: sans }}>Indica dónde exactamente recogerás a los pasajeros</p>
          </div>
        </div>

        {/* Mapa */}
        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Mapa de mis rutas</p>
          {usuario?.id && <MapaRutas tipo="conductor" usuario_id={usuario.id} />}
        </div>

        {/* Mis rutas */}
        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Mis rutas</p>
          {rutas.length === 0 ? (
            <p style={{ color: '#9E9890', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontFamily: sans }}>No tienes rutas registradas.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rutas.map((ruta: any) => (
                <div key={ruta.id}>
                  <div className="ruta-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 100px 80px 80px auto auto auto', gap: '16px', alignItems: 'center', padding: '18px 20px', background: '#FAFAF8', border: '0.5px solid #EDEDE9', borderRadius: rutaExpandida === ruta.id ? '10px 10px 0 0' : '10px' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>ORIGEN</p>
                      <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: sans }}>{ruta.origen}</p>
                      {ruta.punto_encuentro && <p style={{ fontSize: '11px', color: '#9E9890', marginTop: '2px', fontFamily: sans }}>📍 {ruta.punto_encuentro}</p>}
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>DESTINO</p>
                      <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: sans }}>{ruta.destino}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>FECHA</p>
                      <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: sans }}>{formatFecha(ruta.fecha)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>HORA</p>
                      <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: serif }}>{ruta.hora_salida}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>PUESTOS</p>
                      <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: sans }}>{ruta.puestos_disponibles}/{ruta.puestos_totales}</p>
                    </div>
                    <div>{badgeEstado(ruta.estado)}</div>
                    <div>
                      {ruta.estado === 'activa' && (
                        <button onClick={() => handleCompletarRuta(ruta.id)}
                          style={{ background: '#EDEDE9', color: '#1a1a1a', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' }}>
                          Completar
                        </button>
                      )}
                    </div>
                    <div>
                      <button onClick={() => handleExpandirRuta(ruta.id)}
                        style={{ background: rutaExpandida === ruta.id ? '#1a1a1a' : '#EDEDE9', color: rutaExpandida === ruta.id ? '#fff' : '#1a1a1a', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' }}>
                        {rutaExpandida === ruta.id ? 'Cerrar' : 'Pasajeros'}
                      </button>
                    </div>
                  </div>

                  {rutaExpandida === ruta.id && (
                    <div style={{ background: '#F5F5F0', border: '0.5px solid #EDEDE9', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '16px 20px' }}>
                      {!reservasPorRuta[ruta.id] ? (
                        <p style={{ fontSize: '12px', color: '#9E9890', fontFamily: sans }}>Cargando...</p>
                      ) : reservasPorRuta[ruta.id].length === 0 ? (
                        <p style={{ fontSize: '12px', color: '#9E9890', fontFamily: sans }}>No hay pasajeros en esta ruta.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <p style={{ fontSize: '10px', color: '#9E9890', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', fontFamily: sans }}>Pasajeros</p>
                          {reservasPorRuta[ruta.id].map((res: any) => (
                            <div key={res.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '0.5px solid #EDEDE9', borderRadius: '8px', padding: '10px 16px' }}>
                              <div>
                                <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: sans }}>{res.pasajero_nombre}</p>
                                <p style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>{res.estado}</p>
                              </div>
                              {res.estado === 'confirmada' && (
                                <button onClick={() => setChatReserva({ ...res, origen: ruta.origen, destino: ruta.destino })}
                                  style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer', fontFamily: sans }}>
                                  💬 Chat
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buscar ruta como pasajero */}
        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Buscar ruta como pasajero</p>
          <div className="buscar-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Origen</label>
              <select style={selectStyle} value={filtro.origen} onChange={e => setFiltro({ ...filtro, origen: e.target.value })}>
                {origenOptions}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Destino</label>
              <select style={selectStyle} value={filtro.destino} onChange={e => setFiltro({ ...filtro, destino: e.target.value })}>
                {destinoOptions}
              </select>
            </div>
            <button onClick={() => cargarRutasDisponibles(filtro.origen, filtro.destino)}
              style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 28px', fontSize: '13px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' as const }}>
              Buscar
            </button>
          </div>

          {rutasDisponibles.length === 0 ? (
            <p style={{ color: '#9E9890', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontFamily: sans }}>No hay rutas disponibles.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rutasDisponibles.map((ruta: any) => (
                <div key={ruta.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 80px 80px 90px auto', gap: '16px', alignItems: 'center', padding: '18px 20px', background: '#FAFAF8', border: '0.5px solid #EDEDE9', borderRadius: '10px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>ORIGEN</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: sans }}>{ruta.origen}</p>
                    {ruta.punto_encuentro && <p style={{ fontSize: '11px', color: '#9E9890', marginTop: '2px', fontFamily: sans }}>📍 {ruta.punto_encuentro}</p>}
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>DESTINO</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: sans }}>{ruta.destino}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>CONDUCTOR</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: sans }}>{ruta.conductor_nombre}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>HORA</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: serif }}>{ruta.hora_salida}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>PUESTOS</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: sans }}>{ruta.puestos_disponibles}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>CONTRIBUCIÓN</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: serif }}>$4.000</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button onClick={() => handleReservar(ruta.id)} disabled={ruta.puestos_disponibles === 0}
                      style={{ background: ruta.puestos_disponibles === 0 ? '#EDEDE9' : '#1a1a1a', color: ruta.puestos_disponibles === 0 ? '#9E9890' : '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', cursor: ruta.puestos_disponibles === 0 ? 'not-allowed' : 'pointer', fontFamily: sans, whiteSpace: 'nowrap' as const }}>
                      {ruta.puestos_disponibles === 0 ? 'Lleno' : 'Reservar'}
                    </button>
                    {viajesGratisDisponibles > 0 && ruta.puestos_disponibles > 0 && (
                      <button onClick={() => handleUsarViajeGratis(ruta.id)}
                        style={{ background: '#D6CCC2', color: '#1a1a1a', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '11px', cursor: 'pointer', fontFamily: sans, fontWeight: 500, whiteSpace: 'nowrap' as const }}>
                        Usar gratis
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis reservas como pasajero */}
        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Mis reservas como pasajero</p>
          {misReservasComoP.length === 0 ? (
            <p style={{ color: '#9E9890', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontFamily: sans }}>No tienes reservas aun.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {misReservasComoP.map((reserva: any) => (
                <div key={reserva.id} style={{ display: 'grid', gridTemplateColumns: '2fr 80px auto', gap: '16px', alignItems: 'center', padding: '18px 20px', background: '#FAFAF8', border: '0.5px solid #EDEDE9', borderRadius: '10px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>RUTA</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: sans }}>{reserva.origen} → {reserva.destino}</p>
                    <p style={{ fontSize: '11px', color: '#9E9890', marginTop: '2px', fontFamily: sans }}>Conductor: {reserva.conductor_nombre}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>HORA</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: serif }}>{reserva.hora_salida}</p>
                  </div>
                  <div>
                    {(() => {
                      const map: Record<string, React.CSSProperties> = {
                        completada: { background: '#1a1a1a', color: '#EDEDE9' },
                        confirmada: { background: '#D6CCC2', color: '#1a1a1a' },
                        cancelada: { background: '#fee2e2', color: '#991b1b' },
                      };
                      return <span style={{ ...map[reserva.estado], fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500, fontFamily: sans }}>{reserva.estado}</span>;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}