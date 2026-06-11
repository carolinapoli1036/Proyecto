'use client';
import { useEffect, useState } from 'react';
import MapaRutas from '../../components/MapaRutas';
import Chat from '../../components/Chat';
import Notificaciones from '../../components/Notificaciones';

export default function PassengerDashboard() {
  const [usuario, setUsuario] = useState<any>(null);
  const [rutas, setRutas] = useState<any[]>([]);
  const [misReservas, setMisReservas] = useState<any[]>([]);
  const [puntos, setPuntos] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({ origen: '', destino: '' });
  const [chatReserva, setChatReserva] = useState<any>(null);

  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) {
      const user = JSON.parse(data);
      setUsuario(user);
      expirarRutas();
      cargarRutas();
      cargarReservas(user.id);
      cargarPuntos(user.id);
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

  const cargarRutas = async (origen = '', destino = '') => {
    const params = new URLSearchParams();
    if (origen) params.append('origen', origen);
    if (destino) params.append('destino', destino);
    const res = await fetch(`/api/rutas/disponibles?${params}`);
    const data = await res.json();
    if (Array.isArray(data)) setRutas(data);
  };

  const cargarReservas = async (pasajero_id: number) => {
    const res = await fetch(`/api/reservas?pasajero_id=${pasajero_id}`);
    const data = await res.json();
    if (Array.isArray(data)) setMisReservas(data);
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
      cargarRutas();
      cargarReservas(usuario.id);
    } else { setError(data.error); }
  };

  const handleCompletarViaje = async (reserva_id: number) => {
    setMensaje(''); setError('');
    const res = await fetch('/api/reservas/completar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reserva_id }),
    });
    const data = await res.json();
    if (res.ok) {
      setPuntos(data.puntos);
      const viajesGratis = Math.floor(data.puntos / 70);
      if (viajesGratis > 0) {
        setMensaje(`Viaje completado. Tienes ${data.puntos} puntos — ${viajesGratis} viaje${viajesGratis > 1 ? 's' : ''} gratis disponible${viajesGratis > 1 ? 's' : ''}.`);
      } else {
        setMensaje(`Viaje completado. Tienes ${data.puntos} puntos — te faltan ${70 - (data.puntos % 70)} para un viaje gratis.`);
      }
      cargarReservas(usuario.id);
    } else { setError(data.error ?? 'Error al completar viaje'); }
  };

  const handleCancelarReserva = async (reserva_id: number) => {
    if (!confirm('¿Segura que quieres cancelar esta reserva?')) return;
    setMensaje(''); setError('');
    const res = await fetch('/api/reservas/cancelar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reserva_id }),
    });
    const data = await res.json();
    if (res.ok) {
      setMensaje('Reserva cancelada exitosamente');
      cargarRutas();
      cargarReservas(usuario.id);
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
      cargarRutas();
      cargarReservas(usuario.id);
    } else { setError(data.error); }
  };

  const viajesCompletados = misReservas.filter(r => r.estado === 'completada').length;
  const proximoViaje = misReservas.filter(r => r.estado === 'confirmada')[0];
  const viajesGratisDisponibles = Math.floor(puntos / 70);
  const puntosParaSiguiente = 70 - (puntos % 70);

  const badgeEstado = (estado: string) => {
    const map: Record<string, React.CSSProperties> = {
      completada: { background: '#1a1a1a', color: '#EDEDE9' },
      confirmada: { background: '#D6CCC2', color: '#1a1a1a' },
      cancelada: { background: '#fee2e2', color: '#991b1b' },
    };
    return <span style={{ ...map[estado], fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500, fontFamily: sans }}>{estado}</span>;
  };

  const selectStyle: React.CSSProperties = { background: '#FAFAF8', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '11px 14px', fontSize: '13px', color: '#1a1a1a', width: '100%', outline: 'none', fontFamily: sans };

  const origenOptions = (
    <>
      <option value="">Todos los origenes</option>
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

  const destinoOptions = (
    <>
      <option value="">Todos los destinos</option>
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

  return (
    <div style={{ background: '#EDEDE9', minHeight: '100vh', flex: 1, fontFamily: sans }}>

      {chatReserva && usuario && (
        <Chat
          reserva_id={chatReserva.id}
          usuario_id={usuario.id}
          usuario_nombre={usuario.nombre}
          conductor_nombre={chatReserva.conductor_nombre}
          ruta={`${chatReserva.origen} → ${chatReserva.destino}`}
          estadoReserva={chatReserva.estado}
          onCerrar={() => setChatReserva(null)}
        />
      )}

      <div className="navbar" style={{ background: '#1a1a1a', padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#fff', fontFamily: sans }}>CarpoDrive — Pasajero</span>
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
          <p style={{ fontSize: '11px', color: '#6b6b6b', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: sans }}>Panel de pasajero</p>
          <h1 className="hero-title" style={{ fontSize: '42px', fontWeight: 400, color: '#fff', marginBottom: '8px', lineHeight: 1.1, fontFamily: serif }}>
            Hola, <em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>{usuario?.nombre?.split(' ')[0] ?? '...'}</em>
          </h1>
          <p style={{ fontSize: '13px', color: '#6b6b6b', fontFamily: sans, marginBottom: '32px' }}>Carpooling universitario · Medellin</p>

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
            {[
              { label: 'Viajes realizados', value: String(viajesCompletados) },
              { label: 'Proximo viaje', value: proximoViaje ? proximoViaje.hora_salida : '—' },
              { label: 'Mis puntos', value: String(puntos) },
              { label: 'Viajes gratis', value: String(viajesGratisDisponibles) },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#111', padding: '20px 16px' }}>
                <p style={{ fontSize: '10px', color: '#6b6b6b', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: sans }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 400, color: i === 3 && viajesGratisDisponibles > 0 ? '#D6CCC2' : '#fff', lineHeight: 1, fontFamily: serif }}>{stat.value}</p>
                {i === 2 && <p style={{ fontSize: '11px', color: '#4a4a4a', marginTop: '6px', fontFamily: sans }}>{puntosParaSiguiente} pts para viaje gratis</p>}
              </div>
            ))}
          </div>

          {viajesGratisDisponibles > 0 && (
            <div style={{ marginTop: '16px', background: 'rgba(214,204,194,0.1)', border: '0.5px solid rgba(214,204,194,0.3)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#D6CCC2', fontFamily: sans, marginBottom: '4px' }}>
                  Tienes {viajesGratisDisponibles} viaje{viajesGratisDisponibles > 1 ? 's' : ''} gratis disponible{viajesGratisDisponibles > 1 ? 's' : ''}
                </p>
                <p style={{ fontSize: '12px', color: '#6b6b6b', fontFamily: sans }}>Selecciona una ruta y aplica tu viaje gratis</p>
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
        </div>
      </div>

      <div className="dashboard-content" style={{ padding: '36px 40px' }}>
        {mensaje && <div style={{ background: '#1a1a1a', color: '#D6CCC2', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>{mensaje}</div>}
        {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '10px', padding: '14px 20px', fontSize: '13px', marginBottom: '24px', fontFamily: sans }}>{error}</div>}

        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Buscar ruta</p>
          <div className="buscar-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Origen</label>
              <select style={selectStyle} value={filtro.origen} onChange={e => setFiltro({ ...filtro, origen: e.target.value })}>
                {origenOptions}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Destino</label>
              <select style={selectStyle} value={filtro.destino} onChange={e => setFiltro({ ...filtro, destino: e.target.value })}>
                {destinoOptions}
              </select>
            </div>
            <button onClick={() => cargarRutas(filtro.origen, filtro.destino)}
              style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 28px', fontSize: '13px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' as const }}>
              Buscar
            </button>
          </div>
        </div>

        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Mapa de rutas</p>
          <MapaRutas tipo="pasajero" />
        </div>

        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Rutas disponibles</p>
          {rutas.length === 0 ? (
            <p style={{ color: '#9E9890', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontFamily: sans }}>No hay rutas disponibles.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rutas.map((ruta: any) => (
                <div className="ruta-card" key={ruta.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 80px 80px 90px auto', gap: '16px', alignItems: 'center', padding: '18px 20px', background: '#FAFAF8', border: '0.5px solid #EDEDE9', borderRadius: '10px' }}>
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

        <div className="card" style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '28px 32px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '22px', fontFamily: sans }}>Mis reservas</p>
          {misReservas.length === 0 ? (
            <p style={{ color: '#9E9890', fontSize: '13px', textAlign: 'center', padding: '32px 0', fontFamily: sans }}>No tienes reservas aun.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {misReservas.map((reserva: any) => (
                <div className="reserva-card" key={reserva.id} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 90px auto auto auto auto', gap: '16px', alignItems: 'center', padding: '18px 20px', background: '#FAFAF8', border: '0.5px solid #EDEDE9', borderRadius: '10px' }}>
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
                    <p style={{ fontSize: '10px', color: '#9E9890', marginBottom: '4px', fontFamily: sans, letterSpacing: '1px' }}>CONTRIBUCIÓN</p>
                    <p style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500, fontFamily: serif }}>
                      {reserva.estado === 'confirmada' ? '$4.000' : reserva.estado === 'completada' ? '$4.000 ✓' : '—'}
                    </p>
                  </div>
                  <div>{badgeEstado(reserva.estado)}</div>
                  <div>
                    {reserva.estado === 'confirmada' && (
                      <button onClick={() => handleCompletarViaje(reserva.id)}
                        style={{ background: '#EDEDE9', color: '#1a1a1a', border: '0.5px solid #D6CCC2', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' as const }}>
                        Completar viaje
                      </button>
                    )}
                  </div>
                  <div>
                    {reserva.estado === 'confirmada' && (
                      <button onClick={() => handleCancelarReserva(reserva.id)}
                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' as const }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                  <div>
                    {reserva.estado === 'confirmada' && (
                      <button onClick={() => setChatReserva(reserva)}
                        style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', fontFamily: sans, whiteSpace: 'nowrap' as const }}>
                        💬 Chat
                      </button>
                    )}
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