'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMensaje('');
    setError('');
    setCargando(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setCargando(false);

    if (res.ok) {
      setMensaje(`¡Bienvenido, ${data.usuario.nombre}!`);
      if (data.usuario.perfil === 'conductor') {
        window.location.href = '/driver/dashboard';
      } else {
        window.location.href = '/passenger/dashboard';
      }
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">
            🚗 Iniciar Sesión
          </h2>

          {mensaje && <div className="alert alert-success text-sm">{mensaje}</div>}
          {error && <div className="alert alert-error text-sm">{error}</div>}

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Correo electrónico</span>
            </label>
            <input type="email" name="correo" value={formData.correo}
              onChange={handleChange} placeholder="correo@universidad.edu.co"
              className="input input-bordered" />
          </div>

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Contraseña</span>
            </label>
            <input type="password" name="contrasena" value={formData.contrasena}
              onChange={handleChange} placeholder="••••••••"
              className="input input-bordered" />
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={cargando}>
              {cargando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <p className="text-center text-sm mt-2">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="link link-primary">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  );
}