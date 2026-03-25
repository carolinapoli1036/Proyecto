export default function AdminUsers() {
  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content px-6">
        <a href="/admin/dashboard" className="btn btn-ghost btn-sm">← Volver</a>
        <h1 className="text-xl font-bold ml-2">👥 Gestionar Usuarios</h1>
      </div>

      <div className="p-8">

        {/* Botón agregar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lista de Usuarios</h2>
          <button className="btn btn-primary">+ Agregar Usuario</button>
        </div>

        {/* Tabla */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Perfil</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Juan Pérez</td>
                  <td>juan@email.com</td>
                  <td><span className="badge badge-primary">Conductor</span></td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-warning">Editar</button>
                    <button className="btn btn-sm btn-error">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>María López</td>
                  <td>maria@email.com</td>
                  <td><span className="badge badge-secondary">Pasajero</span></td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-warning">Editar</button>
                    <button className="btn btn-sm btn-error">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Carlos Ruiz</td>
                  <td>carlos@email.com</td>
                  <td><span className="badge badge-primary">Conductor</span></td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-warning">Editar</button>
                    <button className="btn btn-sm btn-error">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}