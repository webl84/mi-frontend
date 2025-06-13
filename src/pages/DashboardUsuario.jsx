// DashboardUsuario.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import {
  RectangleGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const DashboardUsuario = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [data, setData] = useState({ nombre: '', email: '', foto: '', avatar: '' });
  const [reseñas, setReseñas] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [vista, setVista] = useState('dashboard');
  const navigate = useNavigate();

  const reseñasOrdenadas = reseñas.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /*useEffect(() => {
    const id = localStorage.getItem('usuarioId') || getCookie('usuarioId');
    if (id) {
      setUsuarioId(id);
      axios.get(`https://mi-backend-tz1u.onrender.com/api/usuarios/perfil/${id}`)
        .then(res => setData(res.data))
        .catch(err => console.error('Error al cargar perfil', err));

      axios.get(`https://mi-backend-tz1u.onrender.com/api/resenas/usuario/${id}`)
        .then(res => setReseñas(res.data))
        .catch(err => console.error('Error al cargar reseñas', err));
    }
  }, []);*/ 


  useEffect(() => {
  axios.get('https://mi-backend-tz1u.onrender.com/api/verify', {
    withCredentials: true,
  })
    .then(res => {
      if (res.data.authenticated) {
        const id = res.data.user.id;
        setUsuarioId(id);

        // Cargar perfil del usuario
        axios.get(`https://mi-backend-tz1u.onrender.com/api/usuarios/perfil/${id}`)
          .then(res => setData(res.data))
          .catch(err => console.error('Error al cargar perfil', err));

        // Cargar reseñas del usuario
        axios.get(`https://mi-backend-tz1u.onrender.com/api/resenas/usuario/${id}`)
          .then(res => setReseñas(res.data))
          .catch(err => console.error('Error al cargar reseñas', err));
      } else {
        console.log("No autenticado");
        navigate("/login");
      }
    })
    .catch(err => {
      console.error('Error al verificar autenticación', err);
      navigate("/login");
    });
}, []);


  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioId");
    document.cookie = "usuarioId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  const avatarSrc = data.foto
    ? (data.foto.startsWith('http') ? data.foto : `https://mi-backend-tz1u.onrender.com/${data.foto.replace(/^\/+/, '')}`)
    : data.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${usuarioId}`;

  const eliminarResena = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado.');
      return;
    }

    try {
      await axios.delete(`https://mi-backend-tz1u.onrender.com/api/resenas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReseñas(reseñas.filter(r => r._id !== id));
    } catch (error) {
      console.error('Error al eliminar reseña', error);
      alert('No se pudo eliminar la reseña. Intenta de nuevo.');
    }
  };

  // NUEVA FUNCIÓN PARA EXPORTAR
  const exportarResenas = () => {
    if (reseñas.length === 0) {
      alert("No hay reseñas para exportar.");
      return;
    }

    const contenido = reseñas.map(r => {
      const fecha = r.fecha ? new Date(r.fecha).toLocaleString() : 'Sin fecha';
      return `Negocio: ${r.negocioId?.nombre || 'Sin nombre'}\nEstrellas: ${r.rating}\nTexto: ${r.texto}\nFecha: ${fecha}\n---`;
    }).join('\n\n');

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'mis_resenas.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-white shadow-md p-6 flex flex-col fixed h-full">
        <div className="sidebar-content">

       
        <h1 className="text-2xl font-bold mb-6"><div className="relative">
            <button  className="flex items-center space-x-2">
              <img src={avatarSrc} alt="avatar" className="w-10 h-10 rounded-full border" />
              <div className="title-content">

          
              <span className="title-btn">
                
              </span>
              <span className="text-lg font-medium">{data.nombre}</span> 
              </div>
              <ChevronDown className="w-4 h-4" />
            </button></div></h1>
       <ul className="space-y-4">
  <li>
    <button
      onClick={() => setVista('dashboard')}
      className={`btn-dasboard w-full text-left text-lg font-medium hover:text-gray-400 flex items-center ${
        vista === 'dashboard' ? 'text-blue-300 font-semibold' : 'text-gray-700'
      }`}
    >
      <RectangleGroupIcon className="w-6 h-6 mr-2" />
      Dashboard
    </button>
  </li>
  <li>
    <button
      onClick={() => setVista('reseñas')}
      className={`btn-dasboard w-full text-left text-lg font-medium hover:text-gray-400 flex items-center ${
        vista === 'reseñas' ? 'text-blue-300 font-semibold' : 'text-gray-700'
      }`}
    >
      <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
      Mis Reseñas
    </button>
  </li>
</ul> </div> 
        <div className="sidebar-bottom flex">
<button  onClick={handleLogout} className="w-full flex items-center gap-2 text-left text-lg font-medium hover:text-gray-400"><LogOut  className="h-6 w-6 text-gray-700" />Cerrar sesión</button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 flex-1 ml-64 p-8"> 
        
        {/* Top bar */}
        <div className="flex justify-end items-center mb-8">
          <div className="relative">
            <button onClick={() => setMostrarMenu(!mostrarMenu)} className="flex items-center space-x-2">
              <img src={avatarSrc} alt="avatar" className="w-10 h-10 rounded-full border" />
              <span className="text-lg font-medium">{data.nombre}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {mostrarMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                <Link to="/perfil" className="flex items-center px-4 py-2 hover:bg-gray-100">
                <User className="w-4 h-4 mr-2" /> Perfil</Link>
                <Link to="/ajustes" className="flex items-center px-4 py-2 hover:bg-gray-100"><Settings className="w-4 h-4 mr-2" /> Ajustes</Link>
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-left"><LogOut className="w-4 h-4 mr-2" /> Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>

        {/* Vista principal: dashboard o reseñas */}
        {vista === 'dashboard' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total de Reseñas</h3>
                <p className="text-3xl font-bold text-blue-600">{reseñas.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Última Actividad</h3>
              {reseñasOrdenadas.length > 0 && reseñasOrdenadas[0].fecha ? (
  <p>{new Date(reseñasOrdenadas[0].fecha).toLocaleString()}</p>
) : (
  <p>Última actividad: Sin actividad reciente</p>
)}

              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Tu resumen</h3>
               {/* <p className="text-3xl font-bold text-yellow-500">
                  {reseñas.length > 0 ? (reseñas.reduce((acc, curr) => acc + curr.estrellas, 0) / reseñas.length).toFixed(1) : '0.0'}
                </p>*/}
                <p>Hola, {data.nombre}! Gracias por ser parte de nuestra comunidad.</p>

              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">Últimas Reseñas</h2>
               {reseñas.length > 0 ? (
    <ul className="space-y-4">
      {reseñas.slice(0, 3).map((resena) => {
        // Convertir foto en array
        const fotos = Array.isArray(resena.foto)
          ? resena.foto
          : resena.foto
            ? [resena.foto]
            : [];

        return (
          <li key={resena._id} className="border-b pb-2">
            <h4 className="font-semibold">{resena.negocioId?.nombre || 'Negocio sin nombre'}</h4>

            {fotos.length > 0 && (
              <div className="mt-1 mb-1 flex space-x-2 overflow-x-auto">
                {fotos.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.startsWith('http') ? img : `https://mi-backend-tz1u.onrender.com/${img.replace(/^\/+/, '')}`}
                    alt={`Foto reseña ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}

            <p className="font-regular">{resena.texto}</p>
            <p className="text-sm text-gray-500">⭐ {resena.rating} estrellas</p> 
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-gray-600">Aún no has publicado reseñas.</p>
  )}
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Mis Reseñas</h2>
            {reseñas.length > 0 ? (
              <ul className="space-y-6">
                {reseñas.map((resena) => {
                  // Asegurar que 'foto' sea siempre un array
                  const fotos = Array.isArray(resena.foto)
                    ? resena.foto
                    : resena.foto
                      ? [resena.foto]
                      : [];

                  return (
                    <li key={resena._id} className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{resena.negocioId.nombre || 'Negocio sin nombre'}</h3>
                        <p className="text-sm text-gray-500">⭐ {resena.rating} estrellas</p>
                      </div>
                      <p className="text-gray-700 mt-1">{resena.texto}</p>

                      {fotos.length > 0 && (
                        <div className="mt-2 flex space-x-2 overflow-x-auto">
                          {fotos.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.startsWith('http') ? img : `https://mi-backend-tz1u.onrender.com/${img.replace(/^\/+/, '')}`}
                              alt={`Foto reseña ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded-md border"
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-400 mt-1">
                        Publicado el {new Date(resena.fecha).toLocaleDateString()}
                      </p>

                      <div className="mt-2 flex space-x-4">
                        <Link to={`/resena/editar/${resena._id}`}>Editar</Link>
                        <button
                          onClick={() => eliminarResena(resena._id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600">No tienes reseñas aún.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardUsuario;
