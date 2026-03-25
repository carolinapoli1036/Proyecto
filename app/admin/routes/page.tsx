export default function AdminRoutes() {
  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content px-6">
        <a href="/admin/dashboard" className="btn btn-ghost btn-sm">← Volver</a>
        <h1 className="text-xl font-bold ml-2">🗺️ Gestionar Rutas</h1>
      </div>

      <div className="p-8">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lista de Rutas</h2>
          <button className="btn btn-primary">+ Agregar Ruta</button>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Conductor</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Centro</td>
                  <td>Universidad</td>
                  <td>Juan Pérez</td>
                  <td>7:00 AM</td>
                  <td><span className="badge badge-success">Activa</span></td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-warning">Editar</button>
                    <button className="btn btn-sm btn-error">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Norte</td>
                  <td>Centro Comercial</td>
                  <td>Carlos Ruiz</td>
                  <td>8:30 AM</td>
                  <td><span className="badge badge-success">Activa</span></td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-warning">Editar</button>
                    <button className="btn btn-sm btn-error">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Sur</td>
                  <td>Aeropuerto</td>
                  <td>Juan Pérez</td>
                  <td>6:00 AM</td>
                  <td><span className="badge badge-error">Inactiva</span></td>
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