export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-3xl"> Carpodrive</h1>
          <p>Bienvenido al sistema de carpooling</p>
          <div className="card-actions mt-4">
            <button className="btn btn-primary">Iniciar Sesión</button>
            <button className="btn btn-outline">Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
}