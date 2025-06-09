import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ListaNegocios = () => {
  const [negocios, setNegocios] = useState([]);
  const baseUrl = "http://localhost:5000/uploads/"; // URL base para imágenes locales

  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/negocios");
        setNegocios(res.data);
      } catch (error) {
        console.error("Error al cargar los negocios:", error);
      }
    };

    fetchNegocios();
  }, []);

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Negocios Populares
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {negocios.map((negocio) => (
            <div
              key={negocio._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Imagen del negocio */}
             
                
          <img src={negocio.imagen} alt="Banner del negocio" className="rounded-t-2xl transition-transform duration-300 hover:scale-105 w-full h-64 object-cover" />

              {/* Info del negocio */}
              <div className="p-4">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mb-2">
                {negocio.categoria?.nombre || "Sin categoría"}

                </span>

                <h3 className="text-xl font-semibold text-gray-800 mb-1">{negocio.nombre}</h3>
                <p className="text-gray-500 text-sm mb-2">{negocio.direccion}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{negocio.descripcion}</p>

                <Link
                  to={`/negocios/${negocio._id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListaNegocios;
