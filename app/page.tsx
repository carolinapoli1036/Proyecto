export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl">🚗 Carpodrive</h1>
          <p>Bienvenido al sistema de carpooling universitario de Medellín</p>
          <div className="card-actions mt-4">
            <a href="/login" className="btn btn-primary">Iniciar Sesión</a>
            <a href="/register" className="btn btn-outline">Registrarse</a>
          </div>
        </div>
      </div>
    </div>
  );
}