import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import EstrellasPromedio from "../components/EstrellasPromedio";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Importaciones para yet-another-react-lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const calcularPromedio = (resenas) => {
  if (resenas.length === 0) return 0;
  const total = resenas.reduce((acc, r) => acc + r.rating, 0);
  return total / resenas.length;
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {Array.from({ length: fullStars }).map((_, i) => (
        <i key={`full-${i}`} className="fas fa-star text-yellow-500"></i>
      ))}
      {hasHalfStar && (
        <i key="half" className="fas fa-star-half-alt text-yellow-500"></i>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <i key={`empty-${i}`} className="far fa-star text-yellow-500"></i>
      ))}
    </>
  );
};

const DetalleNegocio = () => {
  const { id } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [totalResenas, setTotalResenas] = useState(0);
  const [promedioResenas, setPromedioResenas] = useState(0); 

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const resenasPorPagina = 5; // puedes ajustar este valor

  // Estado para el lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  const abrirLightbox = (images, index) => {
    const fullUrls = images.map(img =>
      img.startsWith("http") ? img : `http://localhost:5000/${img.replace(/^\/+/, '')}`
    );
    setLightboxImages(fullUrls);
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const fetchNegocio = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/negocios/${id}`);
      setNegocio(res.data);
    } catch (error) {
      console.error("Error al cargar el negocio:", error.response?.data || error.message);
    }
  };

  const fetchResenas = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/resenas/negocio/${id}`);
      setResenas(res.data);
      setPromedioResenas(calcularPromedio(res.data));
    } catch (error) {
      console.error("Error al cargar las reseñas:", error.response?.data || error.message);
    }
  };

  const fetchTotalResenas = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/resenas/count/${id}`);
      setTotalResenas(res.data.total);
    } catch (error) {
      console.error("Error al obtener total de reseñas:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchNegocio();
    fetchResenas();
    fetchTotalResenas();
  }, [id]);

  if (!negocio) return <p className="text-center text-xl">Cargando...</p>;

  // Paginación: calcular reseñas a mostrar en la página actual
  const indexUltimaResena = paginaActual * resenasPorPagina;
  const indexPrimeraResena = indexUltimaResena - resenasPorPagina;
  const resenasActuales = resenas.slice(indexPrimeraResena, indexUltimaResena);

  // Funciones para cambiar página
  const handlePaginaSiguiente = () => {
    if (paginaActual < Math.ceil(resenas.length / resenasPorPagina)) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const imagenes = negocio.imagen_banner?.length > 0
    ? negocio.imagen_banner
    : [
      "https://placekitten.com/800/426",
      "https://placekitten.com/801/426",
      "https://placekitten.com/802/426"
    ];
   


    
  return (
    <div className="Header-detalle">
    <Header />
    <div className="relative banner-negocio">
      <div className="mx-auto my-6 slider-banner">
        <Slider {...sliderSettings}>
          {imagenes.map((img, index) => (
            <div key={index}>
              <img
                src={img.startsWith("http") ? img : `http://localhost:5000/${img}`}
                alt={`Imagen ${index + 1}`}
                className="w-full h-[426px] object-cover rounded"
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="contenido-negocio absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-4">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">{negocio.nombre}</h1>
          <div className="reviews-points flex flex-col justify-center items-center mt-4 text-yellow-500"> 
           <p> {/* Mostrar el promedio de estrellas */}
            <EstrellasPromedio rating={promedioResenas || 0} /></p>
            {/* Mostrar estrellas según el rating del negocio */}
            {totalResenas > 0 && (
              <p className="text-sm text-gray-300 mt-1">{totalResenas} reseñas en total</p>
            )}
          </div>
          <div className="state mt-4">
            <span className={`text-xl ${negocio.estado ? 'text-green-500' : 'text-yellow-500'}`}>
              {negocio.estado}
            </span>
            <p className="mt-2">{negocio.descripcion}</p>
          </div>
          <div className="info-negocio mt-4">
            <span className={`text-xl ${negocio.abierto ? 'text-green-500' : 'text-red-500'}`}>
              {negocio.abierto ? "Abierto" : "Cerrado"}
            </span>
  {negocio.horario && (
  <div className="mb-2">
    <p className="text-sm text-gray-600">
      Horario general: {negocio.horario.split('\n').slice(0, 2).join(' ')}
    </p>
  </div>
)}

          </div>
        </div>
      </div>
    </div>

  {/* Contenedor principal */}
  <div className="max-w-7xl mx-auto mt-6 p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna Izquierda */}
      <div className="md:col-span-2 space-y-6">
        {/* Botones */}
        <div className="flex gap-4">
          {["Escribir reseña", "Agregar foto", "Compartir", "Guardar"].map((btn) => (
            <button key={btn} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded shadow">
              {btn}
            </button>
          ))}
        </div>

        {/* Contenido específico por categoría */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Especialidades</h2>
          <p>{negocio.categoria?.nombre || "No especificado"}</p>
          </div>

        {/* Las personas también buscaron 
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Las personas también buscaron</h2>
          <p>Contenido sugerido próximamente...</p>
        </div>  */}

        {/* Etiquetas relacionadas */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Etiquetas relacionadas</h2>
          <div className="flex flex-wrap gap-2">
        {negocio.etiquetas.flatMap(tag => 
  tag.split(",").map(subtag => (
    <span key={subtag.trim()} className="bg-gray-200 px-2 py-1 rounded text-sm mr-2">
      {subtag.trim()}
    </span>
  ))
)}


          </div>
        </div>

        {/* Mapa y horario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Ubicación</h3>
            <div className="w-full h-48 bg-gray-300 rounded">
            {negocio.ubicacion?.lat && negocio.ubicacion?.lng ? (
<MapContainer
  center={[negocio.ubicacion.lat, negocio.ubicacion.lng]}
  zoom={25}
  style={{ height: "100%", width: "100%" }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  <Marker position={[negocio.ubicacion.lat, negocio.ubicacion.lng]}>
    <Popup>
      {negocio.nombre}
    </Popup>
  </Marker>
</MapContainer>
) : (
<p>Ubicación no disponible</p>
)}



            </div>
            
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Horario</h3> 
<div className="mt-2 horarios">
  {negocio.horario?.split('\n').map((linea, index) => (
    <p key={index}>{linea}</p>
  ))}
</div>

           { /*<!--<ul>
              <li>Lunes - Viernes: 9:00 AM - 6:00 PM</li>
              <li>Sábado: 10:00 AM - 2:00 PM</li>
              <li>Domingo: Cerrado</li>
            </ul>--> */}
          </div>
        </div>

        {/* Servicios */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Servicios y más</h2>
          <div className="flex flex-wrap gap-4">
          {negocio.servicios.flatMap(tag => 
  tag.split(",").map(subtag => (
    <span key={subtag.trim()} className="bg-gray-200 px-2 py-1 rounded text-sm mr-2">
      {subtag.trim()}
    </span>
  ))
)}
          </div>
        </div>

        {/* Preguntas de usuarios 
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Preguntas frecuentes</h2>
          <ul className="list-disc list-inside">
            <li>¿Se puede reservar?</li>
            <li>¿Tienen menú vegetariano?</li>
          </ul>
        </div>*/}

        {/* Reseñas recomendadas */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Reseñas recomendadas <span className="text-sm text-gray-500">{totalResenas} en total</span>
          </h2>
          {/* Mostrar reseñas paginadas */}
          {resenasActuales.length === 0 ? (
            <p>No hay reseñas para mostrar.</p>
          ) : (
            resenasActuales.map((resena, i) => (
              <div key={resena._id} className="border-b border-gray-200 py-3">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      resena.usuarioId?.foto
                        ? (resena.usuarioId.foto.startsWith("http")
                          ? resena.usuarioId.foto
                          : `http://localhost:5000/${resena.usuarioId.foto.replace(/^\/+/, '')}`)
                        : "https://cdn-icons-png.flaticon.com/512/147/147144.png"
                    }
                    alt={`${resena.usuarioId?.nombre || "Usuario"} perfil`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{resena.usuarioId?.nombre || "Usuario"}</p>
                    <p className="text-yellow-500 text-sm">{renderStars(resena.rating)}</p>
                    <p className="text-sm text-gray-600">{resena.usuarioId?.ubicacion}</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-800">{resena.texto}</p>
                {/* Mostrar imágenes de la reseña */}
                {resena.foto?.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {resena.foto.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.startsWith("http") ? img : `http://localhost:5000/${img.replace(/^\/+/, '')}`}
                        alt={`Foto ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => abrirLightbox(resena.foto, idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}


  {/* Controles de paginación */}
  <div className="flex justify-center items-center gap-4 mt-4">
  {/* Botón anterior con símbolo */}
   {/* Botón Anterior */}
   <button
    onClick={handlePaginaAnterior}
    disabled={paginaActual === 1}
    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
  >
    Anterior
  </button>

  {/* Botones solo con números */}
  {Array.from({ length: Math.ceil(resenas.length / resenasPorPagina) }, (_, i) => (
    <button
      key={i + 1}
      onClick={() => setPaginaActual(i + 1)}
      className={`px-3 py-1 rounded ${
        paginaActual === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
      }`}
    >
      {i + 1}
    </button>
  ))}

  {/* Botón Siguiente */}
  <button
    onClick={handlePaginaSiguiente}
    disabled={paginaActual >= Math.ceil(resenas.length / resenasPorPagina)}
    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
  >
    Siguiente
  </button>
          </div>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Información de contacto</h2>
          {/*<p><strong>Web:</strong> <a href="#" className="text-blue-500">www.negocio.com</a></p*/}
          <p><strong>Teléfono:</strong> {negocio.telefono || "No disponible"}</p>
          <p><strong>Dirección:</strong> {negocio.direccion}</p>
        </div>
      </div>
    </div>
   {/* Lightbox */}
   {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxImages.map(src => ({ src }))}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
        />
      )}

    <Footer />
  </div>
);
};

export default DetalleNegocio;
