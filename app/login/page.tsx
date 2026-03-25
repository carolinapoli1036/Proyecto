export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">
            🚗 Iniciar Sesión
          </h2>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Correo electrónico</span>
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
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

          <div className="form-control mt-6">
            <button className="btn btn-primary">Entrar</button>
          </div>

          <p className="text-center text-sm mt-2">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="link link-primary">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}