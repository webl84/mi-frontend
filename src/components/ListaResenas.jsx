import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";

const renderEstrellas = (rating) => {
  const estrellasCompletas = Math.floor(rating);
  const tieneMediaEstrella = rating - estrellasCompletas >= 0.5;
  const estrellasVacias = 5 - estrellasCompletas - (tieneMediaEstrella ? 1 : 0);

  return (
    <>
      {Array.from({ length: estrellasCompletas }).map((_, i) => (
        <i key={`full-${i}`} className="fas fa-star text-yellow-500"></i>
      ))}
      {tieneMediaEstrella && (
        <i className="fas fa-star-half-alt text-yellow-500"></i>
      )}
      {Array.from({ length: estrellasVacias }).map((_, i) => (
        <i key={`empty-${i}`} className="far fa-star text-yellow-500"></i>
      ))}
    </>
  );
};

const ListaResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const res = await axios.get("https://mi-backend-tz1u.onrender.com/api/resenas/");
        setResenas(res.data);
      } catch (error) {
        console.error("Error al cargar las reseñas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
  }, []);

  const handleCargarMas = () => {
    setVisibleCount(prev => prev + 9);
  };

  if (loading) {
    return <p className="text-center text-lg">Cargando reseñas...</p>;
  }

  // Agrupar reseñas por negocio
  const negociosConResenas = {};
  resenas.forEach((resena) => {
    const negocioId = resena.negocioId?._id;
    if (negocioId) {
      if (!negociosConResenas[negocioId]) {
        negociosConResenas[negocioId] = {
          negocio: resena.negocioId,
          resenas: [],
        };
      }
      negociosConResenas[negocioId].resenas.push(resena);
    }
  });

  // Crear una lista plana de reseñas
  const reseñasPlanas = Object.values(negociosConResenas).flatMap(({ negocio, resenas }) =>
    resenas.map((resena) => ({ negocio, resena }))
  );

  return (
    <section className="seccion-resenas max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Reseñas de todos los negocios</h2>
      <div className="space-y-6 listado-resenas-home">
        {reseñasPlanas.length === 0 ? (
          <p>No hay reseñas disponibles.</p>
        ) : (
          reseñasPlanas.slice(0, visibleCount).map(({ negocio, resena }) => {
            const usuario = resena.usuarioId || {};
            const promedio =
              negocio && negocio._id && negociosConResenas[negocio._id]
                ? negociosConResenas[negocio._id].resenas.reduce((sum, r) => sum + r.rating, 0) /
                  negociosConResenas[negocio._id].resenas.length
                : 0;
            const fechaFormateada = formatDistanceToNow(new Date(resena.fecha), {
              addSuffix: true,
              locale: es,
            });

            return (
              <div
                key={resena._id}
                className="border p-4 rounded shadow-sm bg-white space-y-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      usuario.foto
                        ? usuario.foto.startsWith("http")
                          ? usuario.foto
                          : `https://mi-backend-tz1u.onrender.com/uploads/${usuario.foto}`
                        : "/default-user.jpg"
                    }
                    alt="Perfil del usuario"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="usuario-resena font-semibold">
                      {usuario.nombre || "Usuario desconocido"}
                    </h4>
                    <p className="fecha-resena text-sm text-gray-500">{fechaFormateada}</p>
                  </div>
                </div>

                <div className="mt-2 flex listado-box items-start gap-4">
                  <Link to={`/negocios/${negocio._id}`} className="block">
                    <img
                      src={
                        negocio.imagen?.startsWith("http")
                          ? negocio.imagen
                          : `https://mi-backend-tz1u.onrender.com/${negocio.imagen}`
                      }
                      alt="Imagen del negocio"
                      className="w-full max-w-md rounded shadow hover:opacity-90 transition"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/negocios/${negocio._id}`} className="hover:underline">
                      <h5 className="nombre-negocio font-semibold text-lg text-blue-600">
                        {negocio.nombre || "Negocio desconocido"}
                      </h5>
                    </Link>
                    <div className="text-yellow-500">{renderEstrellas(promedio)}</div>
                    <p className="text-sm text-gray-500">
                      {negociosConResenas[negocio._id]?.resenas.length} reseña
                      {negociosConResenas[negocio._id]?.resenas.length !== 1 && "s"} en total
                    </p>
                  </div>
                </div>

                <p className="texto-resenas text-gray-700">{resena.texto}</p>
              </div>
            );
          })
        )}
      </div>

      {visibleCount < reseñasPlanas.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleCargarMas}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Cargar más
          </button>
        </div>
      )}
    </section>
  );
};

export default ListaResenas;
