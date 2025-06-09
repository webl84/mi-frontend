import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const EditarNegocio = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [categoria, setCategoria] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [estado, setEstado] = useState('');
  const [abierto, setAbierto] = useState('');
  const [imagen, setImagen] = useState(null);
  const [logoImagen, setLogoImagen] = useState(null);
  const [imagenBanner, setImagenBanner] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [horario, setHorario] = useState('');
  const [etiquetas, setEtiquetas] = useState('');
  const [servicios, setServicios] = useState('');

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await axios.get('https://mi-backend-tz1u.onrender.com/api/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    obtenerCategorias();
  }, []);

  useEffect(() => {
    const obtenerNegocio = async () => {
      try {
        const res = await axios.get(`https://mi-backend-tz1u.onrender.com/api/negocios/${id}`);
        const negocio = res.data;

        setNombre(negocio.nombre || '');
        setDescripcion(negocio.descripcion || '');
        setDireccion(negocio.direccion || '');
        setTelefono(negocio.telefono || '');
        setCategoria(negocio.categoria?._id || '');
        setEstado(negocio.estado || '');
        setAbierto(String(negocio.abierto));
        if (negocio.ubicacion) {
          setLatitud(negocio.ubicacion.lat);
          setLongitud(negocio.ubicacion.lng);
        }
        setImagen(negocio.imagen || null);
        setLogoImagen(negocio.logo_imagen || null);
        setImagenBanner(negocio.imagen_banner || []);
        setHorario(JSON.stringify(negocio.horario || {}, null, 2));
        setEtiquetas((negocio.etiquetas || []).join(', '));
        setServicios((negocio.servicios || []).join(', '));
      } catch (error) {
        console.error('Error al obtener negocio:', error);
      }
    };
    obtenerNegocio();
  }, [id]);

  const Mapa = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setLatitud(lat);
        setLongitud(lng);
      },
    });

    return latitud && longitud ? (
      <Marker position={[latitud, longitud]} icon={new L.Icon.Default()} />
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(latitud) || isNaN(longitud)) {
      console.error('Latitud o Longitud no válidas');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('direccion', direccion);
    formData.append('telefono', telefono);
    formData.append('categoria', categoria);
    formData.append('lat', parseFloat(latitud));
    formData.append('lng', parseFloat(longitud));
    formData.append('estado', estado);
    formData.append('abierto', abierto);
    formData.append('horario', horario);
    formData.append('etiquetas', etiquetas);
    formData.append('servicios', servicios);

    if (imagen instanceof File) formData.append('imagen', imagen);
    if (logoImagen instanceof File) formData.append('logo_imagen', logoImagen);
    imagenBanner.forEach(file => {
      if (file instanceof File) formData.append('imagen_banner', file);
    });

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      const response = await axios.put(`https://mi-backend-tz1u.onrender.com/api/negocios/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Negocio actualizado:', response.data);
    } catch (error) {
      console.error('Error al actualizar negocio:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar Negocio</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="input" />
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" className="input" />
        <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="input" />
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="input" />

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input">
          <option value="">Selecciona categoría</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.nombre}</option>
          ))}
        </select>

        <div className="flex space-x-4">
          <input type="number" value={latitud || ''} onChange={(e) => setLatitud(parseFloat(e.target.value))} placeholder="Latitud" className="input" />
          <input type="number" value={longitud || ''} onChange={(e) => setLongitud(parseFloat(e.target.value))} placeholder="Longitud" className="input" />
        </div>

        <MapContainer center={[-12.0464, -77.0428]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Mapa />
        </MapContainer>

        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="input">
          <option value="">Estado</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>

        <select value={abierto} onChange={(e) => setAbierto(e.target.value)} className="input">
          <option value="">¿Abierto?</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>

        <textarea value={horario} onChange={(e) => setHorario(e.target.value)} placeholder="Horario JSON" className="input" rows="4" />
        <input value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} placeholder="Etiquetas separadas por coma" className="input" />
        <input value={servicios} onChange={(e) => setServicios(e.target.value)} placeholder="Servicios separados por coma" className="input" />

        {/* Imagen Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen Principal</label>
          <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} className="input" />
          {imagen && (
            <img
              src={typeof imagen === 'string'
                ? (imagen.startsWith('http') ? imagen : `https://mi-backend-tz1u.onrender.com/uploads/${imagen}`)
                : URL.createObjectURL(imagen)}
              alt="Imagen"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setLogoImagen(e.target.files[0])} className="input" />
          {logoImagen && (
            <img
              src={typeof logoImagen === 'string'
                ? (logoImagen.startsWith('http') ? logoImagen : `https://mi-backend-tz1u.onrender.com/uploads/${logoImagen}`)
                : URL.createObjectURL(logoImagen)}
              alt="Logo"
              className="mt-2 w-20 h-20 object-cover"
            />
          )}
        </div>

        {/* Imágenes de Banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Imágenes de Banner</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setImagenBanner(Array.from(e.target.files))} className="input" />
          <div className="flex space-x-2 mt-2 flex-wrap">
            {imagenBanner.map((img, idx) => (
              <img
                key={idx}
                src={typeof img === 'string'
                  ? (img.startsWith('http') ? img : `https://mi-backend-tz1u.onrender.com/${img}`)
                  : URL.createObjectURL(img)}
                alt={`Banner ${idx}`}
                className="w-24 h-24 object-cover"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Actualizar Negocio</button>
      </form>
    </div>
  );
};

export default EditarNegocio;
