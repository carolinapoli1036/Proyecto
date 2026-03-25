export default function PassengerDashboard() {
  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar */}
      <div className="navbar bg-accent text-accent-content px-6">
        <h1 className="text-xl font-bold">🚗 CarPooling - Pasajero</h1>
        <div className="ml-auto">
          <a href="/login" className="btn btn-ghost btn-sm">Cerrar Sesión</a>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Bienvenida, María López 👋</h2>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold">🗺️ Viajes Realizados</h3>
              <p className="text-4xl font-bold text-accent">12</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-lg font-semibold">📅 Próximo Viaje</h3>
              <p className="text-xl font-bold text-primary">Hoy 7:00 AM</p>
              <p className="text-xs opacity-60">Estación Caribe → UdeA</p>
            </div>
          </div>
          {/* Tarjeta de puntos */}
          <div className="card bg-base-100 shadow border-2 border-warning">
            <div className="card-body">
              <h3 className="text-lg font-semibold">⭐ Mis Puntos</h3>
              <p className="text-4xl font-bold text-warning">180</p>
              <p className="text-xs opacity-60">Nivel: Viajero Activo</p>
            </div>
          </div>
        </div>

        {/* Buscar ruta */}
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">🔍 Buscar Ruta</h3>
            <div className="flex gap-4">

              {/* Tipo de origen */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Tipo de origen</span>
                </label>
                <select className="select select-bordered">
                  <option value="">¿Metro o Comuna?</option>
                  <option value="metro">🚇 Estación Metro</option>
                  <option value="comuna">🏘️ Comuna</option>
                </select>
              </div>

              {/* Origen específico */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Origen específico</span>
                </label>
                <select className="select select-bordered">
                  <option value="">Selecciona el origen</option>
                  <optgroup label="🚇 Estaciones Metro">
                    <option value="niquia">Niquía</option>
                    <option value="bello">Bello</option>
                    <option value="madera">Madera</option>
                    <option value="acevedo">Acevedo</option>
                    <option value="tricentenario">Tricentenario</option>
                    <option value="caribe">Caribe</option>
                    <option value="universidad">Universidad</option>
                    <option value="hospital">Hospital</option>
                    <option value="prado">Prado</option>
                    <option value="parque_berrio">Parque Berrío</option>
                    <option value="san_antonio">San Antonio</option>
                    <option value="alpujarra">Alpujarra</option>
                    <option value="exposiciones">Exposiciones</option>
                    <option value="industriales">Industriales</option>
                    <option value="poblado">El Poblado</option>
                    <option value="aguacatala">Aguacatala</option>
                    <option value="ayura">Ayurá</option>
                    <option value="envigado">Envigado</option>
                    <option value="itagui">Itagüí</option>
                    <option value="la_estrella">La Estrella</option>
                  </optgroup>
                  <optgroup label="🏘️ Comunas">
                    <option value="c1">Comuna 1 - Popular</option>
                    <option value="c2">Comuna 2 - Santa Cruz</option>
                    <option value="c3">Comuna 3 - Manrique</option>
                    <option value="c4">Comuna 4 - Aranjuez</option>
                    <option value="c5">Comuna 5 - Castilla</option>
                    <option value="c6">Comuna 6 - Doce de Octubre</option>
                    <option value="c7">Comuna 7 - Robledo</option>
                    <option value="c8">Comuna 8 - Villa Hermosa</option>
                    <option value="c9">Comuna 9 - Buenos Aires</option>
                    <option value="c10">Comuna 10 - La Candelaria</option>
                    <option value="c11">Comuna 11 - Laureles</option>
                    <option value="c12">Comuna 12 - La América</option>
                    <option value="c13">Comuna 13 - San Javier</option>
                    <option value="c14">Comuna 14 - El Poblado</option>
                    <option value="c15">Comuna 15 - Guayabal</option>
                    <option value="c16">Comuna 16 - Belén</option>
                  </optgroup>
                </select>
              </div>

              {/* Universidad destino */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Universidad destino</span>
                </label>
                <select className="select select-bordered">
                  <option value="">Selecciona la universidad</option>
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

              {/* Botón */}
              <div className="form-control justify-end">
                <button className="btn btn-primary">Buscar</button>
              </div>

            </div>
          </div>
        </div>

        {/* Rutas disponibles */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">🗺️ Rutas Disponibles</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Conductor</th>
                  <th>Hora</th>
                  <th>Puestos</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Estación Caribe</td>
                  <td>Universidad de Antioquia</td>
                  <td>Juan Pérez</td>
                  <td>7:00 AM</td>
                  <td>2 disponibles</td>
                  <td>
                    <button className="btn btn-sm btn-primary">Reservar</button>
                  </td>
                </tr>
                <tr>
                  <td>Comuna 13 - San Javier</td>
                  <td>Universidad EAFIT</td>
                  <td>Carlos Ruiz</td>
                  <td>8:30 AM</td>
                  <td>1 disponible</td>
                  <td>
                    <button className="btn btn-sm btn-primary">Reservar</button>
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