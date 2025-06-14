import { useEffect, useState } from "react";
import axios from "axios";

const EditarPerfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const obtenerUsuario = async () => {
      const usuarioId = localStorage.getItem('usuarioId');

      if (!usuarioId) {
        console.error("No se encontró el ID del usuario en localStorage");
        setCargando(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/api/usuarios/perfil/${usuarioId}`, {
          withCredentials: true,
        });
        setUsuario(data);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, [API_URL]);

  if (cargando) {
    return <div className="text-center mt-10">Cargando perfil...</div>;
  }

  if (!usuario) {
    return <div className="text-center mt-10 text-red-500">No se pudo cargar el perfil del usuario.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            defaultValue={usuario.nombre}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            defaultValue={usuario.email}
            className="w-full border rounded px-3 py-2"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ubicación</label>
          <input
            type="text"
            defaultValue={usuario.ubicacion || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Agrega más campos si lo deseas */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditarPerfil;
