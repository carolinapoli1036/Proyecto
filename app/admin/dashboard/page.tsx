export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content px-6">
        <h1 className="text-xl font-bold">🚗 CarPooling - Admin</h1>
        <div className="ml-auto">
          <a href="/login" className="btn btn-ghost btn-sm">Cerrar Sesión</a>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Panel de Administrador</h2>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold">👥 Usuarios</h3>
              <p className="text-4xl font-bold text-primary">24</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold">🚘 Vehículos</h3>
              <p className="text-4xl font-bold text-secondary">12</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold">🗺️ Rutas</h3>
              <p className="text-4xl font-bold text-accent">8</p>
            </div>
          </div>
        </div>

        {/* Menú de navegación */}
        <div className="grid grid-cols-3 gap-4">
          <a href="/admin/users" className="btn btn-primary btn-lg">
            👥 Gestionar Usuarios
          </a>
          <a href="/admin/vehicles" className="btn btn-secondary btn-lg">
            🚘 Gestionar Vehículos
          </a>
          <a href="/admin/routes" className="btn btn-accent btn-lg">
            🗺️ Gestionar Rutas
          </a>
        </div>
      </div>

    </div>
  );
}