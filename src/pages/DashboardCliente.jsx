import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

// Función para obtener el valor de una cookie
function getCookie(name) {
  let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

const DashboardCliente = () => {
  const [negocios, setNegocios] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabActual, setTabActual] = useState('dashboard'); // Estado para manejar el tab actual

  const clienteId = getCookie('usuarioId');

  useEffect(() => {
    if (!clienteId) {
      console.error('No se encontró el cliente ID en las cookies');
      return;
    }

    const fetchNegociosYResenas = async () => {
      try {
        const token = localStorage.getItem('token');

        // Obtener negocios
        const responseNegocios = await axios.get('http://localhost:5000/api/negocios/mis-negocios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(responseNegocios.data)) {
          setNegocios(responseNegocios.data);
        }

        // Obtener reseñas
        const responseResenas = await axios.get(`http://localhost:5000/api/resenas/cliente/${clienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(responseResenas.data)) {
          setReseñas(responseResenas.data);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNegociosYResenas();
  }, [clienteId]);

  const handleLogout = () => {
    // Eliminar cookies de sesión
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "usuarioId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login"; // Redirigir al login
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col fixed h-full">
        <div className="flex items-center space-x-4 mb-10">
          <img src="https://i.pravatar.cc/50" className="w-12 h-12 rounded-full" alt="User" />
          <div>
            <h2 className="font-semibold">Cliente</h2>
            <p className="text-sm text-gray-500">Bienvenido 👋</p>
          </div>
        </div>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setTabActual('dashboard')}
            className={`flex items-center space-x-2 ${tabActual === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
          >
            <span>🏠</span> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setTabActual('misNegocios')}
            className={`flex items-center space-x-2 ${tabActual === 'misNegocios' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
          >
            <span>🛍️</span> <span>Mis Negocios</span>
          </button>
          <button
            onClick={() => setTabActual('estadisticas')}
            className="flex items-center space-x-2 text-gray-700"
          >
            <span>📈</span> <span>Estadísticas</span>
          </button>
          <button
            onClick={() => setTabActual('configuracion')}
            className="flex items-center space-x-2 text-gray-700"
          >
            <span>⚙️</span> <span>Configuración</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            {tabActual === 'dashboard' && 'Dashboard Cliente'}
            {tabActual === 'misNegocios' && 'Mis Negocios'}
            {tabActual === 'estadisticas' && 'Estadísticas'}
            {tabActual === 'configuracion' && 'Configuración'}
          </h1>
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Buscar..." className="border rounded-lg p-2" />
            <img src="https://i.pravatar.cc/30" className="w-8 h-8 rounded-full" alt="Profile" />
          </div>
        </div>

        {/* Contenido dinámico */}
        {tabActual === 'dashboard' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-blue-500 font-semibold">Negocios</p>
                <p className="text-lg font-bold">{negocios.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-green-500 font-semibold">Reseñas recibidas</p>
                <p className="text-lg font-bold">{reseñas.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-yellow-500 font-semibold">Puntuación promedio</p>
                <p className="text-lg font-bold">
                  {reseñas.length > 0
                    ? (reseñas.reduce((sum, r) => sum + r.calificacion, 0) / reseñas.length).toFixed(1) + ' ⭐'
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-purple-500 font-semibold">Notificaciones</p>
                <p className="text-lg font-bold">0</p>
              </div>
            </div>

            {/* Últimas Reseñas */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Últimas Reseñas</h2>
              {reseñas.length > 0 ? (
                <div className="space-y-4">
                  {reseñas.slice(0, 3).map((resena) => (
                    <div key={resena._id} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{resena.usuarioId?.nombre || 'Usuario Anónimo'}</p>
                        <small className="text-gray-500">"{resena.texto}" - {resena.rating}⭐</small>
                      </div>
                      <button className="text-blue-500">Ver</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tienes reseñas recientes.</p>
              )}
            </div>
          </>
        )}

        {tabActual === 'misNegocios' && (
          <>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
              </div>
            ) : negocios.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {negocios.map((negocio) => (
                  <div key={negocio._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                    <img
                      src={negocio.logo_imagen
                        ? negocio.logo_imagen.startsWith('http')
                          ? negocio.logo_imagen
                          : `http://localhost:5000/uploads/${negocio.logo_imagen}`
                        : 'https://via.placeholder.com/100'}
                      alt={negocio.nombre}
                      className="h-24 w-24 mx-auto object-cover rounded-full mb-4"
                    />
                    <h3 className="text-lg font-bold">{negocio.nombre}</h3>
                    <p className="text-gray-500 mb-2">{negocio.descripcion}</p>
                    <div className="flex justify-between items-center">
                      <Link to={`/editar-negocio/${negocio._id}`} className="text-blue-500">
                        Editar
                      </Link>
                      <button onClick={() => handleDeleteNegocio(negocio._id)} className="text-red-500">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tienes negocios registrados.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardCliente;
