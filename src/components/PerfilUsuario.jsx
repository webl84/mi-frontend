/*import { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderPages from "../components/HeaderPages";
import Footer from "../components/Footer";

const EditarPerfil = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [data, setData] = useState({
    nombre: '',
    email: '',
    foto: '',
  });

  const [avatarSeleccionado, setAvatarSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fotoArchivo, setFotoArchivo] = useState(null);

  const estilosDisponibles = [
    'micah',
    'bottts',
    'pixel-art',
    'adventurer',
    'avataaars',
    'croodles',
    'lorelei', 
    'big-smile'
  ];

  const [estiloSeleccionado, setEstiloSeleccionado] = useState('micah');

  useEffect(() => {
    const id = localStorage.getItem('usuarioId') || getCookie('usuarioId');
    if (id) {
      setUsuarioId(id);
      axios.get(`https://mi-backend-tz1u.onrender.com/api/usuarios/perfil/${id}`)
        .then(response => {
          setData(response.data);
          setNombre(response.data.nombre);
          setEmail(response.data.email);
          setAvatarSeleccionado(response.data.foto || `https://api.dicebear.com/7.x/${estiloSeleccionado}/svg?seed=${id}`);
        })
        .catch(error => {
          console.error('Error al cargar los datos del usuario', error);
        });
    }
  }, []);

  const getCookie = (name) => { 
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const generarAvatares = (cantidad, estilo) => {
    const avatars = [];
    for (let i = 1; i <= cantidad; i++) {
      avatars.push(`https://api.dicebear.com/7.x/${estilo}/svg?seed=${usuarioId}-${i}`);
    }
    return avatars;
  };

  const seleccionarAvatar = (avatar) => {
    setAvatarSeleccionado(avatar);
    setFotoArchivo(null);
  };

  const manejarCambioFoto = (e) => {
    setFotoArchivo(e.target.files[0]);
  };

  const guardarPerfil = () => {
    const datosActualizados = new FormData();
    datosActualizados.append('nombre', nombre);
    datosActualizados.append('email', email);

    if (fotoArchivo) {
      datosActualizados.append('foto', fotoArchivo);
    } else if (avatarSeleccionado) {
      datosActualizados.append('foto', avatarSeleccionado);
    }

    axios.put(`https://mi-backend-tz1u.onrender.com/api/usuarios/${usuarioId}/actualizarPerfil`, datosActualizados)
      .then(response => {
        alert('Perfil actualizado correctamente');
        setData(response.data);
      })
      .catch(error => {
        console.error('Error al actualizar el perfil', error);
      });
  };

  return (
   */
{/*
    <div className="">
      <div className="class"><HeaderPages/></div> 
      <div className='perfil flex justify-center'>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4">Editar Perfil</h1>

        <div className="flex items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 mr-4">
            <img src={avatarSeleccionado} alt="Foto de perfil" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xl font-medium">{nombre}</p>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Selecciona tu Avatar</h3>
          <div className="flex">
            {/* Lista lateral de estilos 
            <div className="w-1/4 pr-4 border-r">
              {estilosDisponibles.map((estilo) => (
                <button
                  key={estilo}
                  onClick={() => setEstiloSeleccionado(estilo)}
                  className={`block w-full text-left p-2 mb-2 rounded 
                    ${estilo === estiloSeleccionado ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
                >
                  {estilo}
                </button>
              ))}
            </div>

            {/* Galería de avatares del estilo seleccionado 
            <div className="w-3/4 pl-4 grid grid-cols-5 gap-4">
              {usuarioId && generarAvatares(20, estiloSeleccionado).map((avatar, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 
                  ${avatar === avatarSeleccionado ? 'border-blue-500' : 'border-gray-300'} 
                  cursor-pointer hover:border-blue-400`}
                  onClick={() => seleccionarAvatar(avatar)}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Sube tu foto de perfil</label>
          <input
            type="file"
            onChange={manejarCambioFoto}
            className="w-full p-2 mt-2 border rounded-md"
          />
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={guardarPerfil}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
      </div>
      <Footer/>
    </div> 
    
  );
};

export default EditarPerfil;*/} 


import { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderPages from "../components/HeaderPages";
import Footer from "../components/Footer";

const EditarPerfil = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [avatarSeleccionado, setAvatarSeleccionado] = useState('');
  const [fotoArchivo, setFotoArchivo] = useState(null);
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('micah');

  const estilosDisponibles = [
    'micah', 'bottts', 'pixel-art', 'adventurer', 'avataaars',
    'croodles', 'lorelei', 'big-smile'
  ];

  // 🔍 Leer cookie si no hay en localStorage
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // 📦 Cargar datos del perfil
  useEffect(() => {
    const id = localStorage.getItem('usuarioId') || getCookie('usuarioId');
    if (id) {
      setUsuarioId(id);
      axios.get(`https://mi-backend-tz1u.onrender.com/api/usuarios/perfil/${id}`)
        .then(response => {
          console.log("✅ Datos de usuario cargados:", response.data);
          const { nombre, email, foto } = response.data;
          setNombre(nombre || '');
          setEmail(email || '');
          setAvatarSeleccionado(foto || `https://api.dicebear.com/7.x/${estiloSeleccionado}/svg?seed=${id}`);
        })
        .catch(error => {
          console.error('❌ Error al cargar perfil:', error);
        });
    } else {
      console.warn('⚠️ No se encontró usuarioId en localStorage ni cookies');
    }
  }, []);

  // 🧠 Generar avatares (usa localStorage directo para evitar delay de useState)
  const generarAvatares = (cantidad, estilo) => {
    const id = localStorage.getItem('usuarioId') || getCookie('usuarioId');
    if (!id) return [];
    return Array.from({ length: cantidad }, (_, i) =>
      `https://api.dicebear.com/7.x/${estilo}/svg?seed=${id}-${i + 1}`
    );
  };

  const seleccionarAvatar = (avatar) => {
    setAvatarSeleccionado(avatar);
    setFotoArchivo(null); // Limpia archivo si eliges avatar
  };

  const manejarCambioFoto = (e) => {
    setFotoArchivo(e.target.files[0]);
  };

  const guardarPerfil = () => {
    if (!usuarioId) return alert("No se encontró ID del usuario.");

    const datosActualizados = new FormData();
    datosActualizados.append('nombre', nombre);
    datosActualizados.append('email', email);

    if (fotoArchivo) {
      datosActualizados.append('foto', fotoArchivo);
    } else if (avatarSeleccionado) {
      datosActualizados.append('foto', avatarSeleccionado);
    }

    axios.put(`https://mi-backend-tz1u.onrender.com/api/usuarios/${usuarioId}/actualizarPerfil`, datosActualizados)
      .then(response => {
        alert('✅ Perfil actualizado correctamente');
        const { nombre, email, foto } = response.data;
        setNombre(nombre);
        setEmail(email);
        setAvatarSeleccionado(foto);
      })
      .catch(error => {
        console.error('❌ Error al actualizar el perfil', error);
      });
  };

  return (
    <div>
      <HeaderPages />
      <div className="perfil flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-semibold mb-4">Editar Perfil</h1>

          {/* Avatar actual */}
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 mr-4">
              <img src={avatarSeleccionado} alt="Foto de perfil" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xl font-medium">{nombre}</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>

          {/* Avatares */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Selecciona tu Avatar</h3>
            <div className="flex">
              {/* Estilos */}
              <div className="w-1/4 pr-4 border-r">
                {estilosDisponibles.map((estilo) => (
                  <button
                    key={estilo}
                    onClick={() => setEstiloSeleccionado(estilo)}
                    className={`block w-full text-left p-2 mb-2 rounded 
                      ${estilo === estiloSeleccionado ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
                  >
                    {estilo}
                  </button>
                ))}
              </div>

              {/* Avatares generados */}
              <div className="w-3/4 pl-4 grid grid-cols-5 gap-4">
                {generarAvatares(20, estiloSeleccionado).map((avatar, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-full overflow-hidden border-2 
                    ${avatar === avatarSeleccionado ? 'border-blue-500' : 'border-gray-300'} 
                    cursor-pointer hover:border-blue-400`}
                    onClick={() => seleccionarAvatar(avatar)}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subir foto */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Sube tu foto de perfil</label>
            <input
              type="file"
              onChange={manejarCambioFoto}
              className="w-full p-2 mt-2 border rounded-md"
            />
          </div>

          {/* Datos */}
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 mt-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={guardarPerfil}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditarPerfil;

