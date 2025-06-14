import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Select from "react-select";
import HeaderPages from "../components/HeaderPages";

const URL_BASE = "https://mi-backend-tz1u.onrender.com/uploads/";

function EditarResena() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    negocioId: "",
    texto: "",
    rating: 5,
    titulo: "",
    foto: [],
  });

  const [fotosExistentes, setFotosExistentes] = useState([]);
  const [fotosAEliminar, setFotosAEliminar] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioId = Cookies.get("usuarioId");

    const fetchData = async () => {
      try {
        const [resNegocios, resResena] = await Promise.all([
          axios.get("https://mi-backend-tz1u.onrender.com/api/negocios"),
          axios.get(`https://mi-backend-tz1u.onrender.com/api/resenas/${id}`),
        ]);

        setNegocios(resNegocios.data);

        const resena = resResena.data;
        if (resena.usuarioId !== usuarioId) {
          setMensaje("No tienes permiso para editar esta reseña.");
          setCargando(false);
          return;
        }

        setFormData({
          negocioId:
            typeof resena.negocioId === "object"
              ? resena.negocioId._id
              : resena.negocioId,
          texto: resena.texto,
          rating: resena.rating,
          titulo: resena.titulo || "",
          foto: [],
        });

        const fotosNormalizadas = (resena.foto || [])
          .map((f) => {
            if (typeof f === "object" && f !== null) {
              if (f.nombre) return f.nombre;
              if (f.path) return f.path.split("/").pop();
            } else if (typeof f === "string") {
              return f.split("/").pop();
            }
            return "";
          })
          .filter((foto) => foto);

        setFotosExistentes(fotosNormalizadas);
      } catch (error) {
        console.error(error);
        setMensaje("Error al cargar los datos.");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      foto: [...prev.foto, ...Array.from(e.target.files)],
    }));
  };

  const toggleEliminarFoto = (fotoNombre) => {
    setFotosAEliminar((prev) =>
      prev.includes(fotoNombre)
        ? prev.filter((f) => f !== fotoNombre)
        : [...prev, fotoNombre]
    );
  };

  const eliminarNuevaFoto = (index) => {
    setFormData((prev) => {
      const nuevasFotos = [...prev.foto];
      nuevasFotos.splice(index, 1);
      return { ...prev, foto: nuevasFotos };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioId = Cookies.get("usuarioId");

    if (!formData.negocioId || !formData.texto || !usuarioId) {
      setMensaje("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const data = new FormData();
      data.append("negocioId", formData.negocioId);
      data.append("texto", formData.texto);
      data.append("rating", formData.rating);
      data.append("titulo", formData.titulo);
      data.append("usuarioId", usuarioId);

      formData.foto.forEach((file) => data.append("foto", file));
      fotosAEliminar.forEach((f) => data.append("fotosAEliminar", f));

      await axios.put(`https://mi-backend-tz1u.onrender.com/api/resenas/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensaje("¡Reseña actualizada con éxito!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      setMensaje(error.response?.data?.message || "Error al actualizar la reseña.");
    }
  };

  if (cargando) return <p className="text-center p-6">Cargando...</p>;

  return (
    <div>
      <HeaderPages />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Editar Reseña</h2>

          {mensaje && (
            <p className="text-center mb-4 font-semibold text-red-600">{mensaje}</p>
          )}

          {mensaje.includes("permiso") ? null : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Negocio */}
              <div>
                <label className="block font-medium mb-1">Selecciona un negocio</label>
                <Select
                  options={negocios.map((n) => ({ value: n._id, label: n.nombre }))}
                  value={
                    negocios.find((n) => n._id === formData.negocioId) && {
                      value: formData.negocioId,
                      label: negocios.find((n) => n._id === formData.negocioId).nombre,
                    }
                  }
                  onChange={(opt) =>
                    setFormData((prev) => ({ ...prev, negocioId: opt.value }))
                  }
                  className="w-full"
                />
              </div>

              {/* Título */}
              <div>
                <label className="block font-medium mb-1">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="Título de la reseña"
                />
              </div>

              {/* Texto */}
              <div>
                <label className="block font-medium mb-1">Reseña</label>
                <textarea
                  name="texto"
                  value={formData.texto}
                  onChange={handleChange}
                  className="w-full border p-2 rounded resize-none"
                  rows={4}
                  placeholder="Describe tu experiencia..."
                />
              </div>

              {/* Calificación */}
              <div>
                <label className="block font-medium mb-1">Calificación</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} ⭐
                    </option>
                  ))}
                </select>
              </div>

              {/* Fotos existentes */}
              {fotosExistentes.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Fotos actuales (marca para eliminar):</p>
                  <div className="flex space-x-4 overflow-x-auto">
                    {fotosExistentes.map((foto, i) => (
                      <div key={i} className="relative w-24 h-24">
                        <img
                          src={`${URL_BASE}${foto}`}
                          alt={`Foto ${i + 1}`}
                          className={`w-full h-full object-cover rounded border ${
                            fotosAEliminar.includes(foto) ? "opacity-50 grayscale" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleEliminarFoto(foto)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          title={
                            fotosAEliminar.includes(foto)
                              ? "Desmarcar para eliminar"
                              : "Marcar para eliminar"
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fotos nuevas */}
              {formData.foto.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Nuevas fotos seleccionadas:</p>
                  <div className="flex space-x-4 overflow-x-auto">
                    {formData.foto.map((file, i) => {
                      const url = URL.createObjectURL(file);
                      return (
                        <div key={i} className="relative w-24 h-24">
                          <img
                            src={url}
                            alt={`Nueva ${i + 1}`}
                            className="w-full h-full object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => eliminarNuevaFoto(i)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            title="Eliminar foto"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Input archivos */}
              <div>
                <label className="block font-medium mb-1">Agregar nuevas fotos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition-colors text-white font-bold py-2 px-4 rounded w-full"
              >
                Guardar cambios
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditarResena;
