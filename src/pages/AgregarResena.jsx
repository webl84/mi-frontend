import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Select from "react-select";
import HeaderPages from "../components/HeaderPages";

function AgregarResena() {
  const [formData, setFormData] = useState({
    negocioId: "",
    texto: "",
    rating: 5,
    titulo: "",
    foto: null,
  });

  const [negocios, setNegocios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mostrarSugerencia, setMostrarSugerencia] = useState(false);
  const [sugerencia, setSugerencia] = useState({ nombre: "", descripcion: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const res = await axios.get("https://mi-backend-tz1u.onrender.com/api/negocios");
        setNegocios(res.data);
      } catch (error) {
        setMensaje("Error al cargar los negocios.");
      }
    };

    fetchNegocios();

    const usuarioId = Cookies.get("usuarioId");
    if (!usuarioId) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      foto: Array.from(e.target.files), // convierte FileList a array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioId = Cookies.get("usuarioId");

    if (!formData.negocioId || !formData.texto || !formData.titulo) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("negocioId", formData.negocioId);
      formDataToSend.append("texto", formData.texto);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("usuarioId", usuarioId);
      if (formData.foto && formData.foto.length > 0) {
        formData.foto.forEach((file) => {
          formDataToSend.append("foto", file);
        });
      }

      await axios.post("https://mi-backend-tz1u.onrender.com/api/resenas", formDataToSend);
      setMensaje("¡Reseña publicada con éxito!");

      setFormData({
        negocioId: "",
        texto: "",
        rating: 5,
        titulo: "",
        foto: null,
      });

      // Auto ocultar mensaje luego de 4 segundos
      setTimeout(() => {
        setMensaje("");
      }, 4000);
    } catch (error) {
      setMensaje(
        error.response?.data?.message || "Error al publicar la reseña."
      );
    }
  };

  const enviarSugerencia = async () => {
    try {
      await axios.post("https://mi-backend-tz1u.onrender.com/api/sugerencias", sugerencia);
      alert("Gracias por tu sugerencia.");
      setSugerencia({ nombre: "", descripcion: "" });
      setMostrarSugerencia(false);
    } catch (error) {
      alert("Error al enviar la sugerencia.");
    }
  };

  return (

    <div className=""> 
       <div className="headeresena"
       > <HeaderPages/></div> 
       <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4"> 

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Publicar Reseña</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Selecciona un negocio</label>
            <Select
              options={negocios.map((negocio) => ({
                value: negocio._id,
                label: negocio.nombre,
              }))}
              onChange={(selectedOption) =>
                setFormData((prev) => ({ ...prev, negocioId: selectedOption.value }))
              }
              required
              className="w-full"
              placeholder="Selecciona un negocio"
            />
          </div>
{/*
          <button
            type="button"
            onClick={() => setMostrarSugerencia(!mostrarSugerencia)}
            className="text-sm text-blue-600 underline"
          >
            ¿No encuentras el negocio? Sugiérelo aquí
          </button>

          {mostrarSugerencia && (
            <div className="bg-gray-50 p-4 rounded border mt-2">
              <label className="block font-medium mb-1">Nombre del negocio</label>
              <input
                type="text"
                className="w-full border p-2 rounded mb-2"
                value={sugerencia.nombre}
                onChange={(e) =>
                  setSugerencia({ ...sugerencia, nombre: e.target.value })
                }
              />

              <label className="block font-medium mb-1">Descripción (opcional)</label>
              <textarea
                className="w-full border p-2 rounded mb-2"
                rows="3"
                value={sugerencia.descripcion}
                onChange={(e) =>
                  setSugerencia({ ...sugerencia, descripcion: e.target.value })
                }
              />

              <button
                type="button"
                onClick={enviarSugerencia}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Enviar sugerencia
              </button>
            </div>
          )}*/}

          <div>
            <label className="block font-medium mb-1">Título de la reseña</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Escribe un título"
            />
          </div> 

          <div>
            <label className="block font-medium mb-1">Tu reseña</label>
            <textarea
              name="texto"
              value={formData.texto}
              onChange={handleChange}
              rows={4}
              className="w-full border p-2 rounded resize-none"
              placeholder="Describe tu experiencia..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Calificación</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} ⭐
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Foto (opcional)</label>
            <input
  type="file"
  name="foto"
  multiple
  onChange={handleFileChange}
  accept="image/*"
  className="w-full border p-2 rounded"
/>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Enviar Reseña
          </button>
        </form>

        {mensaje && (
          <p
            className={`mt-4 text-center font-medium ${
              mensaje.includes("éxito") ? "text-green-600" : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div></div>
  );
}

export default AgregarResena;
