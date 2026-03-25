export default function AdminVehicles() {
  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content px-6">
        <a href="/admin/dashboard" className="btn btn-ghost btn-sm">← Volver</a>
        <h1 className="text-xl font-bold ml-2">🚘 Gestionar Vehículos</h1>
      </div>

      <div className="p-8">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lista de Vehículos</h2>
          <button className="btn btn-primary">+ Agregar Vehículo</button>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Conductor</th>
                  <th>Capacidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>ABC-123</td>
                  <td>Toyota</td>
                  <td>Corolla</td>
                  <td>Juan Pérez</td>
                  <td>4</td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-warning">Editar</button>
                    <button className="btn btn-sm btn-error">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>XYZ-456</td>
                  <td>Chevrolet</td>
                  <td>Spark</td>
                  <td>Carlos Ruiz</td>
                  <td>3</td>
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