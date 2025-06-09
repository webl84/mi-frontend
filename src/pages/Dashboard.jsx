import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/verify", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
          fetchResenas(data.user.id);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Token inválido");
        navigate("/login");
      }
    };

    const fetchResenas = async (usuarioId) => {
      try {
        const res = await fetch(`http://localhost:5000/api/resenas/usuario/${usuarioId}`);
        const data = await res.json();
        setResenas(data);
      } catch (err) {
        console.error("Error al obtener reseñas del usuario:", err);
      }
    };

    verifyAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-6 py-8 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">MiPanel</h2>
        {user && (
          <div className="mb-6">
            <p className="text-gray-600">Bienvenido</p>
            <p className="font-semibold">{user.nombre}</p>
          </div>
        )}
        <nav className="space-y-4">
          <Link to="/dashboard" className="block text-blue-600 hover:underline">
            Dashboard
          </Link>
          <Link to="/resena/nueva" className="block text-blue-600 hover:underline">
            Nueva Reseña
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative">
        {/* Header con perfil */}
        <div className="flex justify-end mb-6">
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-2 bg-white px-3 py-2 rounded-full shadow hover:shadow-md transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {getInitial(user.nombre)}
                </div>
                <span className="font-medium text-gray-800">{user.nombre}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Ver perfil
                  </Link>
                  <Link
                    to="/configuracion"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Configuración
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Mis Reseñas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Mis Reseñas</h2>
          {resenas.length === 0 ? (
            <p className="text-gray-500">No has publicado reseñas aún.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resenas.map((resena) => (
                <div
                  key={resena._id}
                  className="bg-white p-4 rounded shadow border"
                >
                  <h3 className="font-bold text-lg">
                    {resena.negocioId?.nombre || "Negocio"}
                  </h3>
                  <p className="text-gray-700">{resena.texto}</p>
                  <span className="text-yellow-500">{resena.rating} ⭐</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Futuro */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Otras funcionalidades (en construcción)</h2>
          <p className="text-gray-400">Aquí aparecerán estadísticas, favoritos, etc.</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
