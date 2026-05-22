export default function Home() {
  const serif = "'DM Serif Display', Georgia, serif";
  const sans = "'DM Sans', system-ui, sans-serif";

  return (
    <div style={{ background: '#EDEDE9', minHeight: '100vh', flex: 1, fontFamily: sans, display: 'flex', flexDirection: 'column' }}>

      <div style={{ background: '#1a1a1a', padding: '0 48px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff', fontFamily: sans, letterSpacing: '0.3px' }}>CarPoolDrive</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/login" style={{ fontSize: '13px', color: '#9E9890', textDecoration: 'none', padding: '7px 16px', border: '0.5px solid #3a3a3a', borderRadius: '6px' }}>
            Iniciar sesion
          </a>
          <a href="/register" style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', padding: '7px 16px', background: '#EDEDE9', borderRadius: '6px', fontWeight: 500 }}>
            Registrarse
          </a>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', padding: '100px 48px 120px', position: 'relative', overflow: 'hidden', flex: 1 }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '350px', height: '350px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '30%', width: '300px', height: '300px', borderRadius: '50%', border: '0.5px solid rgba(255,255,255,0.04)' }} />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 16px', marginBottom: '40px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D6CCC2', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '1.5px', textTransform: 'uppercase' as const, fontFamily: sans }}>Carpooling universitario · Medellin</span>
          </div>

          <h1 style={{ fontSize: '64px', fontWeight: 400, color: '#fff', lineHeight: 1.05, marginBottom: '24px', fontFamily: serif, letterSpacing: '-1px' }}>
            Comparte el viaje,<br />
            <em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>comparte el camino</em>
          </h1>

          <p style={{ fontSize: '16px', color: '#6b6b6b', lineHeight: 1.7, marginBottom: '48px', maxWidth: '480px', fontFamily: sans, fontWeight: 300 }}>
            Conectamos estudiantes universitarios de Medellin para compartir rutas, reducir costos y llegar juntos a la U.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="/register" style={{ background: '#EDEDE9', color: '#1a1a1a', textDecoration: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '14px', fontWeight: 500, fontFamily: sans }}>
              Crear cuenta gratis
            </a>
            <a href="/login" style={{ color: '#9E9890', textDecoration: 'none', fontSize: '14px', fontFamily: sans, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Ya tengo cuenta <span style={{ fontSize: '18px' }}>→</span>
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', overflow: 'hidden', marginTop: '80px', width: 'fit-content' }}>
          {[
            { value: '100+', label: 'Estudiantes registrados' },
            { value: '16+', label: 'Universidades conectadas' },
            { value: '10 pts', label: 'Por cada viaje completado' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#111', padding: '24px 28px' }}>
              <p style={{ fontSize: '26px', fontWeight: 400, color: '#fff', marginBottom: '6px', fontFamily: serif }}>{stat.value}</p>
              <p style={{ fontSize: '11px', color: '#6b6b6b', fontFamily: sans }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#EDEDE9', padding: '80px 48px' }}>
        <p style={{ fontSize: '11px', color: '#9E9890', letterSpacing: '2px', textTransform: 'uppercase' as const, marginBottom: '48px', fontFamily: sans }}>Como funciona</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { num: '01', title: 'Registrate', desc: 'Crea tu cuenta con tu correo universitario y selecciona tu perfil: conductor o pasajero.' },
            { num: '02', title: 'Encuentra tu ruta', desc: 'Busca rutas disponibles desde tu estacion de metro o comuna hacia tu universidad.' },
            { num: '03', title: 'Viaja y gana puntos', desc: 'Completa viajes y acumula puntos. Cada 70 puntos obtienes un viaje gratis.' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #D6CCC2', borderRadius: '16px', padding: '32px' }}>
              <p style={{ fontSize: '11px', color: '#D6CCC2', letterSpacing: '2px', marginBottom: '20px', fontFamily: sans }}>{f.num}</p>
              <h3 style={{ fontSize: '22px', fontWeight: 400, color: '#1a1a1a', marginBottom: '12px', fontFamily: serif }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#9E9890', lineHeight: 1.7, fontFamily: sans, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#1a1a1a', padding: '80px 48px', textAlign: 'center' as const }}>
        <h2 style={{ fontSize: '42px', fontWeight: 400, color: '#fff', marginBottom: '16px', fontFamily: serif }}>
          Listo para <em style={{ fontStyle: 'italic', color: '#D6CCC2' }}>empezar?</em>
        </h2>
        <p style={{ fontSize: '14px', color: '#6b6b6b', marginBottom: '40px', fontFamily: sans, fontWeight: 300 }}>Unete a la comunidad de carpooling universitario de Medellin.</p>
        <a href="/register" style={{ background: '#EDEDE9', color: '#1a1a1a', textDecoration: 'none', borderRadius: '10px', padding: '14px 40px', fontSize: '14px', fontWeight: 500, fontFamily: sans }}>
          Comenzar ahora
        </a>
      </div>

    </div>
  );
}