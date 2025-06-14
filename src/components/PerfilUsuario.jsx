import React, { useEffect, useState } from "react";
import axios from "axios";

function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const { data } = await axios.get(
          "https://mi-backend-tz1u.onrender.com/api/usuarios/perfil",
          {
            withCredentials: true, // Muy importante para enviar la cookie
          }
        );
        setUsuario(data);
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError("No se pudo cargar el perfil.");
      }
    };

    obtenerPerfil();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!usuario) {
    return <div className="text-center mt-4">Cargando perfil...</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Perfil de Usuario</h2>
      <img
        src={usuario.foto}
        alt="Foto de perfil"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Ubicación:</strong> {usuario.ubicacion}</p>
      <p><strong>Rol:</strong> {usuario.rol}</p>
    </div>
  );
}

export default PerfilUsuario;
