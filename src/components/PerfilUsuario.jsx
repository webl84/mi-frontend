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

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const id = localStorage.getItem('usuarioId') || getCookie('usuarioId');
    console.log('Obtenido usuarioId:', id);

    if (id) {
      setUsuarioId(id);

      axios.get(`https://mi-backend-tz1u.onrender.com/api/usuarios/perfil/${id}`)
        .then(response => {
          console.log('Datos recibidos del perfil:', response.data);
          const { nombre, email, foto } = response.data;

          setNombre(nombre || '');
          setEmail(email || '');
          setAvatarSeleccionado(foto || `https://api.dicebear.com/7.x/${estiloSeleccionado}/svg?seed=${id}`);
        })
        .catch(error => {
          console.error('Error al cargar perfil:', error.response?.data || error.message);
        });
    } else {
      console.warn('No se encontró el ID del usuario en localStorage ni cookies.');
    }
  }, []);

  const generarAvatares = (cantidad, estilo) => {
    if (!usuarioId) return [];
    return Array.from({ length: cantidad }, (_, i) =>
      `https://api.dicebear.com/7.x/${estilo}/svg?seed=${usuarioId}-${i + 1}`
    );
  };

  const seleccionarAvatar = (avatar) => {
    setAvatarSeleccionado(avatar);
    setFotoArchivo(null);
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
        alert('Perfil actualizado correctamente');
        const { nombre, email, foto } = response.data;
        setNombre(nombre);
        setEmail(email);
        setAvatarSeleccionado(foto);
      })
      .catch(error => {
        console.error('Error al actualizar el perfil', error.response?.data || error.message);
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
              <img src={avatarSeleccionado} alt="Foto de perfil" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xl font-medium">{nombre}</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>

          {/* Avatares y selección de estilo */}
          {/* ... mismos bloques anteriores ... */}

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
