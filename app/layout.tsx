import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarPooling App",
  description: "Sistema de carpooling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <aside className="w-64 bg-primary text-primary-content flex flex-col p-4 gap-2">
            <h1 className="text-xl font-bold mb-4">🚗 CarPooling</h1>

            <p className="text-xs font-bold opacity-60 uppercase mt-2">General</p>
            <a href="/" className="btn btn-ghost justify-start">🏠 Inicio</a>
            <a href="/login" className="btn btn-ghost justify-start">🔐 Login</a>
            <a href="/register" className="btn btn-ghost justify-start">📝 Registro</a>

            <p className="text-xs font-bold opacity-60 uppercase mt-4">Administrador</p>
            <a href="/admin/dashboard" className="btn btn-ghost justify-start">📊 Dashboard Admin</a>
            <a href="/admin/users" className="btn btn-ghost justify-start">👥 Usuarios</a>
            <a href="/admin/vehicles" className="btn btn-ghost justify-start">🚘 Vehículos</a>
            <a href="/admin/routes" className="btn btn-ghost justify-start">🗺️ Rutas</a>

            <p className="text-xs font-bold opacity-60 uppercase mt-4">Perfiles</p>
            <a href="/driver/dashboard" className="btn btn-ghost justify-start">🧑‍✈️ Conductor</a>
            <a href="/passenger/dashboard" className="btn btn-ghost justify-start">🧑‍💼 Pasajero</a>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}