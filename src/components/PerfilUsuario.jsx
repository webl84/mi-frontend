import { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderPages from "../components/HeaderPages";
import Footer from "../components/Footer";

const EditarPerfil = () => {
  const [data, setData] = useState({ nombre: '', email: '', foto: '', _id: '' });
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(null);
  const [fotoArchivo, setFotoArchivo] = useState(null);

  const estilosDisponibles = [
    'micah', 'bottts', 'pixel-art', 'adventurer',
    'avataaars', 'croodles', 'lorelei', 'big-smile'
  ];
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('micah');

  useEffect(() => {
    axios.get("https://mi-backend-tz1u.onrender.com/api/usuarios/perfil", {
      withCredentials: true,
    })
    .then((res) => {
      setData(res.data);
      setNombre(res.data.nombre);
      setEmail(res.data.email);
      setAvatarSeleccionado(res.data.foto || `https://api.dicebear.com/7.x/${estiloSeleccionado}/svg?seed=${res.data._id}`);
    })
    .catch((err) => {
      console.error("Error al cargar perfil", err);
    });
  }, [estiloSeleccionado]);

  const generarAvatares = (cantidad) => {
    const avatars = [];
    for (let i = 1; i <= cantidad; i++) {
      avatars.push(`https://api.dicebear.com/7.x/${estiloSeleccionado}/svg?seed=${data._id}-${i}`);
    }
    return avatars;
  };

  const seleccionarAvatar = (avatar) => {
    setAvatarSeleccionado(avatar);
    setFotoArchivo(null); // Si elige avatar, se descarta la foto subida
  };

  const manejarCambioFoto = (e) => {
    setFotoArchivo(e.target.files[0]);
    setAvatarSeleccionado(null); // Si sube archivo, se descarta el avatar
  };

  const guardarPerfil = () => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);

    // Prioridad: si subió archivo, ese gana. Si no, se usa avatar.
    if (fotoArchivo) {
      formData.append('foto', fotoArchivo);
    } else if (avatarSeleccionado) {
      formData.append('avatarUrl', avatarSeleccionado); // campo extra opcional para tu backend
    }

    axios.put("https://mi-backend-tz1u.onrender.com/api/usuarios/editar-perfil", formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => {
      alert("Perfil actualizado correctamente");
      setData(res.data);
    })
    .catch((err) => {
      console.error("Error al guardar perfil", err);
    });
  };

  return (
    <div>
      <HeaderPages />
      <div className="perfil flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-2xl font-semibold mb-4">Editar Perfil</h1>

          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 mr-4">
              <img src={avatarSeleccionado || data.foto} alt="Foto de perfil" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xl font-medium">{nombre}</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Selecciona tu Avatar</h3>
            <div className="flex">
              <div className="w-1/4 pr-4 border-r">
                {estilosDisponibles.map((estilo) => (
                  <button key={estilo} onClick={() => setEstiloSeleccionado(estilo)}
                    className={`block w-full text-left p-2 mb-2 rounded 
                      ${estilo === estiloSeleccionado ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}>
                    {estilo}
                  </button>
                ))}
              </div>
              <div className="w-3/4 pl-4 grid grid-cols-5 gap-4">
                {data._id && generarAvatares(20).map((avatar, i) => (
                  <div key={i}
                    className={`w-16 h-16 rounded-full overflow-hidden border-2 
                      ${avatar === avatarSeleccionado ? 'border-blue-500' : 'border-gray-300'} 
                      cursor-pointer hover:border-blue-400`}
                    onClick={() => seleccionarAvatar(avatar)}>
                    <img src={avatar} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Sube tu foto de perfil</label>
            <input type="file" onChange={manejarCambioFoto} className="w-full p-2 mt-2 border rounded-md" />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md" />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md" />
          </div>

          <div className="mt-6">
            <button onClick={guardarPerfil} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
