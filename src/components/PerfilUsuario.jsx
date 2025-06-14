import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const EditarPerfil = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    email: "",
    foto: null,
  });
  const [nuevaFoto, setNuevaFoto] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const id = decoded.id || decoded._id || decoded.userId;

        if (id) {
          setUsuarioId(id);
          obtenerDatosUsuario(id);
        } else {
          console.warn("No se encontró el ID en el token.");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    } else {
      console.warn("No se encontró token en localStorage.");
    }
  }, []);

  const obtenerDatosUsuario = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/usuarios/perfil/${id}`,
        {
          withCredentials: true,
        }
      );
      const { nombre, email, foto } = response.data;
      setDatosUsuario({ nombre, email, foto });
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosUsuario((prevDatos) => ({
      ...prevDatos,
      [name]: value,
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setNuevaFoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioId) {
      console.error("No se puede enviar el formulario sin un ID de usuario.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", datosUsuario.nombre);
    formData.append("email", datosUsuario.email);
    if (nuevaFoto) {
      formData.append("foto", nuevaFoto);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/usuarios/actualizar-perfil/${usuarioId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Perfil actualizado:", response.data);
      alert("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Hubo un error al actualizar el perfil");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={datosUsuario.nombre}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={datosUsuario.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Foto de Perfil</label>
          {datosUsuario.foto && (
            <img
              src={`${import.meta.env.VITE_API_URL}/${datosUsuario.foto}`}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full mb-2"
            />
          )}
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleFotoChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditarPerfil;
