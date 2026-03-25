export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-[480px] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">
            🚗 Crear Cuenta
          </h2>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Nombre completo</span>
            </label>
            <input
              type="text"
              placeholder="Paula Gil"
              className="input input-bordered"
            />
          </div>

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Correo electrónico</span>
            </label>
            <input
              type="email"
              placeholder="correo@universidad.edu.co"
              className="input input-bordered"
            />
          </div>

          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Contraseña</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
            />
          </div>

          {/* Rol en la plataforma */}
          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Perfil</span>
            </label>
            <select className="select select-bordered">
              <option value="">Selecciona un perfil</option>
              <option value="driver">Conductor</option>
              <option value="passenger">Pasajero</option>
              <option value="teacher">Docente</option>
            </select>
          </div>

          {/* Universidad */}
          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text">Universidad</span>
            </label>
            <select className="select select-bordered">
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
            <button className="btn btn-primary">Registrarse</button>
          </div>

          <p className="text-center text-sm mt-2">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="link link-primary">
              Inicia Sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}