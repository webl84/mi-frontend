// src/pages/CategoriaDetalle.jsx
import React, { useEffect, useState } from 'react';
import axios from '../config/axiosConfig';
import { useParams } from 'react-router-dom';
import HeaderPages from "../components/HeaderPages";
import EstrellasPromedio from "../components/EstrellasPromedio";
import { iconosServicios, iconoGenerico } from '../components/iconosServicios';
import Footer from "../components/Footer";

const calcularPromedio = (resenas) => {
  if (resenas.length === 0) return 0;
  const total = resenas.reduce((acc, r) => acc + r.rating, 0);
  return total / resenas.length;
};

const CategoriaDetalle = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [negocios, setNegocios] = useState([]);
  const [negociosFiltrados, setNegociosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorResenas, setErrorResenas] = useState(null);
  const [filtros, setFiltros] = useState({ servicios: [], etiquetas: [] });
  const [verMasServicios, setVerMasServicios] = useState(false);
  const [verMasEtiquetas, setVerMasEtiquetas] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const negociosPorPagina = 10;

  const fetchCategoria = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/categorias/${id}`);
      setCategoria(response.data.categoria);

      const negociosConResenas = await Promise.all(
        response.data.negocios.map(async (negocio) => {
          const resenas = await fetchResenas(negocio._id);
          const total = await fetchTotalResenas(negocio._id);
          return { ...negocio, resenas, totalResenas: total };
        })
      );

      setNegocios(negociosConResenas);
      setNegociosFiltrados(negociosConResenas);
      setLoading(false);
    } catch (error) {
      setErrorResenas("Error al obtener la categoría o los negocios.");
      setLoading(false);
    }
  };

  const fetchResenas = async (negocioId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/resenas/negocio/${negocioId}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 404) return [];
      setErrorResenas("Error al cargar las reseñas.");
      return [];
    }
  };

  const fetchTotalResenas = async (negocioId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/resenas/count/${negocioId}`);
      return res.data.total;
    } catch (error) {
      setErrorResenas("Error al obtener el total de reseñas.");
      return 0;
    }
  };

  useEffect(() => {
    fetchCategoria();
  }, [id]);

  const handleFiltro = (tipo, valor) => {
    setFiltros((prev) => {
      const yaSeleccionado = prev[tipo].includes(valor);
      const nuevos = yaSeleccionado
        ? prev[tipo].filter((v) => v !== valor)
        : [...prev[tipo], valor];
      return { ...prev, [tipo]: nuevos };
    });
  };

  useEffect(() => {
    const filtrados = negocios.filter((negocio) => {
      const cumpleServicios =
        filtros.servicios.length === 0 ||
        (negocio.servicios && filtros.servicios.some((f) => negocio.servicios.includes(f)));
      const cumpleEtiquetas =
        filtros.etiquetas.length === 0 ||
        (negocio.etiquetas && filtros.etiquetas.some((f) => negocio.etiquetas.includes(f)));
      return cumpleServicios && cumpleEtiquetas;
    });
    setNegociosFiltrados(filtrados);
    setCurrentPage(1); // Reiniciar a página 1 al filtrar
  }, [filtros, negocios]);

  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }

  const serviciosUnicos = Array.from(new Set(negocios.flatMap(n => n.servicios || [])));
  const etiquetasUnicas = Array.from(new Set(negocios.flatMap(n => n.etiquetas || [])));

  const indexUltimo = currentPage * negociosPorPagina;
  const indexPrimero = indexUltimo - negociosPorPagina;
  const negociosPaginaActual = negociosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(negociosFiltrados.length / negociosPorPagina);

  return (
    <div className="mx-auto">
      <div className="header-categories">
        <HeaderPages />
      </div>
      <div className="content-categories flex flex-col lg:flex-row gap-8 px-4">
        <div className="sidebar-categories w-full bg-white p-4 rounded shadow sticky top-0 max-h-screen">
          <div className="filtros"><strong>Filtros</strong></div>
          {(filtros.servicios.length > 0 || filtros.etiquetas.length > 0) && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Filtros activos:</h3>
              {[...filtros.servicios, ...filtros.etiquetas].map((f, idx) => (
                <span key={idx} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded mr-2 mb-2">{f}</span>
              ))}
            </div>
          )}
          <div className="servicios">
            <h2 className="text-lg font-semibold mb-2">Servicios ofrecidos</h2>
            {(verMasServicios ? serviciosUnicos : serviciosUnicos.slice(0, 6)).map((servicio) => (
              <label key={servicio} className="block text-sm">
                <input
                  type="checkbox"
                  checked={filtros.servicios.includes(servicio)}
                  onChange={() => handleFiltro("servicios", servicio)}
                  className="mr-2"
                />
                {servicio}
              </label>
            ))}
            {serviciosUnicos.length > 6 && (
              <button
                onClick={() => setVerMasServicios(!verMasServicios)}
                className="text-blue-600 text-sm mt-1"
              >
                {verMasServicios ? "Ver menos" : "Ver más"}
              </button>
            )}
          </div>
          <h2 className="text-lg font-semibold mt-6 mb-2">Etiquetas destacadas</h2>
          {(verMasEtiquetas ? etiquetasUnicas : etiquetasUnicas.slice(0, 6)).map((etiqueta) => (
            <label key={etiqueta} className="block text-sm">
              <input
                type="checkbox"
                checked={filtros.etiquetas.includes(etiqueta)}
                onChange={() => handleFiltro("etiquetas", etiqueta)}
                className="mr-2"
              />
              {etiqueta}
            </label>
          ))}
          {etiquetasUnicas.length > 6 && (
            <button
              onClick={() => setVerMasEtiquetas(!verMasEtiquetas)}
              className="text-blue-600 text-sm mt-1"
            >
              {verMasEtiquetas ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>

        <div className="content-details w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{categoria.nombre}</h1>
            <p className="text-lg text-gray-600">{categoria.descripcion}</p>
          </div>

          <div className="grid grid-categories grid-cols-1 gap-8">
            {negociosPaginaActual.length > 0 ? (
              negociosPaginaActual.map((negocio) => (
                <div key={negocio._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    src={negocio.imagen || '/images/default-banner.jpg'}
                    alt={negocio.nombre}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">{negocio.nombre}</h3>
                    <div className="promedio-estrellas flex items-center">
                      <EstrellasPromedio rating={calcularPromedio(negocio.resenas)} />
                      <span className="ml-2 text-sm text-gray-600">
                        {negocio.totalResenas} Reseñas
                      </span>
                    </div>
                    <div className="state">
                      <span className={`text-xl ${negocio.abierto ? 'text-green-500' : 'text-red-500'}`} >
                        {negocio.abierto ? "Abierto" : "Cerrado"}
                      </span>
                    </div> 
                    <div className="servicios mt-2">
  {negocio.servicios?.length > 0 ? (
    negocio.servicios.map((tag) => {
      const key = tag.toLowerCase().trim();
      const icono = iconosServicios[key] ?? iconoGenerico;

      return (
        <span
          key={tag}
          className="inline-flex items-center bg-gray-200 px-2 py-1 rounded text-sm mr-2 gap-1"
        >
          {icono}
          {tag}
        </span>
      );
    })
  ) : (
    <p className="text-sm text-gray-400">No hay servicios disponibles</p>
  )}
                    </div>
                    {negocio.resenas && negocio.resenas.length > 0 && (() => {
                      const reseñaDestacada = negocio.resenas.find(r => r.rating >= 4);
                      return reseñaDestacada ? (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md shadow-sm">
                          <p className="text-sm text-gray-800 italic">“{reseñaDestacada.texto}”</p>
                          <p className="text-xs text-gray-500 mt-1">— {reseñaDestacada.usuario?.nombre || "Usuario"}</p>
                        </div>
                      ) : null;
                    })()}
                    <div className="etiquetas mt-3">
                      {negocio.etiquetas?.length > 0 ? (
                        negocio.etiquetas.map((tag) => (
                          <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm mr-2">{tag}</span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No hay etiquetas disponibles</p>
                      )}
                    </div>





                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No se encontraron negocios con los filtros seleccionados.</p>
            )}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="inline-flex">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-4 py-2 mx-1 rounded ${
                      currentPage === num ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoriaDetalle;
