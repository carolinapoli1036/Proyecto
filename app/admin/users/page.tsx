'use client';

import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Modal agregar/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '', correo: '', contrasena: '', perfil: '', universidad: ''
  });

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsuarios(data);
    setCargando(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Abrir modal para AGREGAR
  const abrirModalAgregar = () => {
    setEditando(false);
    setFormData({ nombre: '', correo: '', contrasena: '', perfil: '', universidad: '' });
    setModalAbierto(true);
  };

  // Abrir modal para EDITAR
  const abrirModalEditar = (usuario: any) => {
    setEditando(true);
    setUsuarioSeleccionado(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasena: '',
      perfil: usuario.perfil,
      universidad: usuario.universidad || ''
    });
    setModalAbierto(true);
  };

  // GUARDAR (crear o editar)
  const guardar = async () => {
    setMensaje('');
    setError('');

    if (editando) {
      // EDITAR
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: usuarioSeleccionado.id, ...formData }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Usuario actualizado ✅');
        setModalAbierto(false);
        cargarUsuarios();
      } else {
        setError(data.error);
      }
    } else {
      // CREAR
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Usuario creado ✅');
        setModalAbierto(false);
        cargarUsuarios();
      } else {
        setError(data.error);
      }
    }
  };

  // ELIMINAR
  const eliminar = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setMensaje('Usuario eliminado ✅');
      cargarUsuarios();
    }
  };

  const badgePerfil = (perfil: string) => {
    if (perfil === 'conductor') return 'badge badge-primary';
    if (perfil === 'pasajero') return 'badge badge-secondary';
    return 'badge badge-accent';
  };

  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content px-6">
        <a href="/admin/dashboard" className="btn btn-ghost btn-sm">← Volver</a>
        <h1 className="text-xl font-bold ml-2">👥 Gestionar Usuarios</h1>
      </div>

      <div className="p-8">

        {mensaje && <div className="alert alert-success mb-4">{mensaje}</div>}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        {/* Botón agregar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lista de Usuarios</h2>
          <button className="btn btn-primary" onClick={abrirModalAgregar}>
            + Agregar Usuario
          </button>
        </div>

        {/* Tabla */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            {cargando ? (
              <p className="text-center py-8">Cargando usuarios...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Perfil</th>
                    <th>Universidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u: any) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td><span className={badgePerfil(u.perfil)}>{u.perfil}</span></td>
                      <td>{u.universidad || '—'}</td>
                      <td className="flex gap-2">
                        <button className="btn btn-sm btn-warning" onClick={() => abrirModalEditar(u)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-error" onClick={() => eliminar(u.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Agregar/Editar */}
      {modalAbierto && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editando ? '✏️ Editar Usuario' : '➕ Agregar Usuario'}
            </h3>

            <div className="form-control mb-3">
              <label className="label"><span className="label-text">Nombre</span></label>
              <input type="text" name="nombre" value={formData.nombre}
                onChange={handleChange} className="input input-bordered" />
            </div>

            <div className="form-control mb-3">
              <label className="label"><span className="label-text">Correo</span></label>
              <input type="email" name="correo" value={formData.correo}
                onChange={handleChange} className="input input-bordered" />
            </div>

            {!editando && (
              <div className="form-control mb-3">
                <label className="label"><span className="label-text">Contraseña</span></label>
                <input type="password" name="contrasena" value={formData.contrasena}
                  onChange={handleChange} className="input input-bordered" />
              </div>
            )}

            <div className="form-control mb-3">
              <label className="label"><span className="label-text">Perfil</span></label>
              <select name="perfil" value={formData.perfil}
                onChange={handleChange} className="select select-bordered">
                <option value="">Selecciona un perfil</option>
                <option value="conductor">Conductor</option>
                <option value="pasajero">Pasajero</option>
                <option value="docente">Docente</option>
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Universidad</span></label>
              <select name="universidad" value={formData.universidad}
                onChange={handleChange} className="select select-bordered">
                <option value="">Selecciona universidad</option>
                <option value="udea">Universidad de Antioquia</option>
                <option value="eafit">Universidad EAFIT</option>
                <option value="upb">Universidad Pontificia Bolivariana</option>
                <option value="unal">Universidad Nacional - Sede Medellín</option>
                <option value="itm">Instituto Tecnológico Metropolitano</option>
                <option value="pascual">Universidad Pascual Bravo</option>
                <option value="ces">Universidad CES</option>
                <option value="uniminuto">Uniminuto Medellín</option>
              </select>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar}>
                {editando ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}