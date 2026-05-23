'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', perfil: '', universidad: '', tipo_conductor: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";

  const handleSubmit = async () => {
    setError(''); setCargando(true);
    if (!form.nombre || !form.correo || !form.contrasena || !form.perfil || !form.universidad) {
      setError('Por favor completa todos los campos'); setCargando(false); return;
    }
    if (form.perfil === 'conductor' && !form.tipo_conductor) {
      setError('Selecciona si eres estudiante o docente'); setCargando(false); return;
    }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) window.location.href = '/login';
    else { setError(data.error ?? 'Error al registrarse'); setCargando(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#fff', border: '0.5px solid #D6CCC2',
    borderRadius: '8px', padding: '12px 16px', fontSize: '13px',
    color: '#1a1a1a', outline: 'none', fontFamily: sans, boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flex: 1, fontFamily: sans }}>

      <div style={{ width: '45%', background: '#1a1a1a', padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '220px', height: '220px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)' }} />

        <div>
          <a href="/" style={{ fontSize: '15px', fontWeight: 500, color: '#fff', textDecoration: 'none', fontFamily: sans }}>CARPODRIVE</a>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '11px', color: '#6b6b6b', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '24px', fontFamily: sans }}>Unete a la comunidad</p>
          <h1 style={{ fontSize: '48px', fontWeight: 400, color: '#fff', lineHeight: 1.1, fontFamily: serif, marginBottom: '20px' }}>
            Empieza tu<br /><em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>viaje</em>
          </h1>
          <p style={{ fontSize: '14px', color: '#6b6b6b', lineHeight: 1.7, fontFamily: sans, fontWeight: 300, maxWidth: '320px' }}>
            Registrate como conductor o pasajero y conecta con estudiantes de tu universidad.
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
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '32px', fontFamily: sans }}>Crear cuenta</p>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', marginBottom: '20px', fontFamily: sans }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Nombre completo</label>
            <input type="text" placeholder="Tu nombre completo" style={inputStyle}
              value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Correo electronico</label>
            <input type="email" placeholder="correo@universidad.edu.co" style={inputStyle}
              value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Contraseña</label>
            <input type="password" placeholder="••••••••" style={inputStyle}
              value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Perfil</label>
            <select style={inputStyle} value={form.perfil} onChange={e => setForm({ ...form, perfil: e.target.value, tipo_conductor: '' })}>
              <option value="">Selecciona un perfil</option>
              <option value="pasajero">Pasajero</option>
              <option value="conductor">Conductor</option>
            </select>
          </div>

          {form.perfil === 'conductor' && (
            <div style={{ marginBottom: '16px', background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '10px', padding: '16px' }}>
              <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '1px', marginBottom: '12px', fontFamily: sans }}>Eres estudiante o docente?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[{ v: 'estudiante', l: 'Estudiante', desc: 'Comparte el viaje con tus compañeros' }, { v: 'docente', l: 'Docente', desc: 'Ofrece rutas a los estudiantes' }].map(op => (
                  <div key={op.v} onClick={() => setForm({ ...form, tipo_conductor: op.v })}
                    style={{ padding: '14px', borderRadius: '8px', cursor: 'pointer', background: form.tipo_conductor === op.v ? '#1a1a1a' : '#FAFAF8', border: `0.5px solid ${form.tipo_conductor === op.v ? '#1a1a1a' : '#D6CCC2'}`, transition: 'all 0.15s' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: form.tipo_conductor === op.v ? '#fff' : '#1a1a1a', marginBottom: '4px', fontFamily: sans }}>{op.l}</p>
                    <p style={{ fontSize: '11px', color: '#9E9890', fontFamily: sans }}>{op.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '11px', color: '#9E9890', display: 'block', marginBottom: '8px', fontFamily: sans }}>Universidad</label>
            <select style={inputStyle} value={form.universidad} onChange={e => setForm({ ...form, universidad: e.target.value })}>
              <option value="">Selecciona tu universidad</option>
              <optgroup label="Universidades">
                <option value="Universidad de Antioquia">Universidad de Antioquia</option>
                <option value="Universidad Nacional de Colombia">Universidad Nacional</option>
                <option value="Universidad EAFIT">Universidad EAFIT</option>
                <option value="Universidad Pontificia Bolivariana">UPB</option>
                <option value="Universidad de Medellín">Universidad de Medellin</option>
                <option value="Universidad CES">Universidad CES</option>
                <option value="Universidad Cooperativa de Colombia">U. Cooperativa</option>
                <option value="Universidad Autónoma Latinoamericana">UNAULA</option>
                <option value="Universidad Remington">U. Remington</option>
                <option value="Universidad San Buenaventura">U. San Buenaventura</option>
                <option value="Universidad Católica Luis Amigó">U. Católica Luis Amigo</option>
                <option value="Universidad Luis Amigó">Funlam</option>
                <option value="Universitaria Agustiniana">Uniagustiniana</option>
              </optgroup>
              <optgroup label="Tecnologicos e Institutos">
                <option value="Politécnico Colombiano Jaime Isaza Cadavid">Politecnico Colombiano</option>
                <option value="Instituto Tecnológico Metropolitano">ITM</option>
                <option value="Institución Universitaria Pascual Bravo">Pascual Bravo</option>
                <option value="Institución Universitaria Colegio Mayor">Colegio Mayor</option>
                <option value="Institución Universitaria Digital de Antioquia">Digital de Antioquia</option>
                <option value="Tecnológico de Antioquia">Tecnologico de Antioquia</option>
                <option value="SENA Regional Antioquia">SENA</option>
                <option value="Escolme">Escolme</option>
              </optgroup>
            </select>
          </div>

          <button onClick={handleSubmit} disabled={cargando}
            style={{ width: '100%', background: '#1a1a1a', color: '#EDEDE9', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: 500, cursor: cargando ? 'not-allowed' : 'pointer', fontFamily: sans, marginBottom: '20px', opacity: cargando ? 0.7 : 1 }}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>

          <p style={{ textAlign: 'center' as const, fontSize: '13px', color: '#9E9890', fontFamily: sans }}>
            Ya tienes cuenta?{' '}
            <a href="/login" style={{ color: '#1a1a1a', fontWeight: 500, textDecoration: 'none' }}>Inicia sesion</a>
          </p>
        </div>
      </div>
    </div>
  );
}