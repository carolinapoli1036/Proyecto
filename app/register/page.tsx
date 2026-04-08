'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    perfil: '',
    universidad: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMensaje('');
    setError('');
    setCargando(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setCargando(false);

    if (res.ok) {
      setMensaje(data.mensaje);
      setFormData({ nombre: '', correo: '', contrasena: '', perfil: '', universidad: '' });
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-[480px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">
            🚗 Crear Cuenta
          </h2>

          {mensaje && <div className="alert alert-success text-sm">{mensaje}</div>}
          {error && <div className="alert alert-error text-sm">{error}</div>}

          <div className="form-control mt-4">
            <label className="label"><span className="label-text">Nombre completo</span></label>
            <input type="text" name="nombre" value={formData.nombre}
              onChange={handleChange} placeholder="Paula Gil" className="input input-bordered" />
          </div>

          <div className="form-control mt-2">
            <label className="label"><span className="label-text">Correo electrónico</span></label>
            <input type="email" name="correo" value={formData.correo}
              onChange={handleChange} placeholder="correo@universidad.edu.co" className="input input-bordered" />
          </div>

          <div className="form-control mt-2">
            <label className="label"><span className="label-text">Contraseña</span></label>
            <input type="password" name="contrasena" value={formData.contrasena}
              onChange={handleChange} placeholder="••••••••" className="input input-bordered" />
          </div>

          <div className="form-control mt-2">
            <label className="label"><span className="label-text">Perfil</span></label>
            <select name="perfil" value={formData.perfil} onChange={handleChange} className="select select-bordered">
              <option value="">Selecciona un perfil</option>
              <option value="conductor">Conductor</option>
              <option value="pasajero">Pasajero</option>
              <option value="docente">Docente</option>
            </select>
          </div>

          <div className="form-control mt-2">
            <label className="label"><span className="label-text">Universidad</span></label>
            <select name="universidad" value={formData.universidad} onChange={handleChange} className="select select-bordered">
              <option value="">Selecciona tu universidad</option>
              <option value="udea">Universidad de Antioquia</option>
              <option value="eafit">Universidad EAFIT</option>
              <option value="upb">Universidad Pontificia Bolivariana</option>
              <option value="unal">Universidad Nacional - Sede Medellín</option>
              <option value="itm">Instituto Tecnológico Metropolitano</option>
              <option value="pascual">Universidad Pascual Bravo</option>
              <option value="ces">Universidad CES</option>
              <option value="lasalle">Universidad de La Salle</option>
              <option value="uniminuto">Uniminuto Medellín</option>
              <option value="ceipa">CEIPA Business School</option>
              <option value="politecnico">Politécnico Colombiano Jaime Isaza Cadavid</option>
            </select>
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={cargando}>
              {cargando ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <p className="text-center text-sm mt-2">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="link link-primary">Inicia Sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}