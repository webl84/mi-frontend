// CrearNegocio.jsx
import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker = ({ setLatitud, setLongitud, closeModal }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
      setTimeout(() => {
        closeModal();
      }, 500);
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const CrearNegocio = () => {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [logoImagen, setLogoImagen] = useState(null);
  const [imagenBanner, setImagenBanner] = useState([]);
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [estado, setEstado] = useState('');
  const [abierto, setAbierto] = useState('');
  const [servicios, setServicios] = useState('');
  const [etiquetas, setEtiquetas] = useState('');
  const [horario, setHorario] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    obtenerCategorias();
  }, []);

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (name === 'imagen') setImagen(files[0]);
    else if (name === 'logo_imagen') setLogoImagen(files[0]);
    else if (name === 'imagen_banner') setImagenBanner(Array.from(files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('direccion', direccion);
    formData.append('telefono', telefono);
    formData.append('categoria', categoria);
    formData.append('lat', latitud);
    formData.append('lng', longitud);
    formData.append('estado', estado);
    formData.append('abierto', abierto);
    formData.append('etiquetas', etiquetas);
    formData.append('servicios', servicios);
    formData.append('horario', horario);

    if (imagen) formData.append('imagen', imagen);
    if (logoImagen) formData.append('logo_imagen', logoImagen);
    imagenBanner.forEach(file => formData.append('imagen_banner', file));

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se ha encontrado el token de autenticación.');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const clienteID = decodedToken.id;
    formData.append('clienteId', clienteID);

    try {
      const response = await axios.post('http://localhost:5000/api/negocios/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('✅ Negocio creado exitosamente:', response.data);
      setSuccessMessage('✅ Negocio creado con éxito.');
      resetForm();
    } catch (error) {
      console.error('❌ Error al crear negocio:', error);
    }
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setDireccion('');
    setTelefono('');
    setCategoria('');
    setLatitud('');
    setLongitud('');
    setEstado('');
    setAbierto('');
    setServicios('');
    setEtiquetas('');
    setHorario('');
    setImagen(null);
    setLogoImagen(null);
    setImagenBanner([]);
    setStep(1);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Negocio</h1>

      {successMessage && (
        <div className="p-4 mb-6 text-green-800 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del negocio" className="input" required />
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" rows="4" className="input" required />
            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="input" required />
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="input" required />

            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={latitud} onChange={(e) => setLatitud(parseFloat(e.target.value))} placeholder="Latitud" className="input" required />
              <input type="number" value={longitud} onChange={(e) => setLongitud(parseFloat(e.target.value))} placeholder="Longitud" className="input" required />
            </div>

            <div className="text-center">
              <button type="button" onClick={openModal} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Elegir ubicación en el mapa
              </button>
            </div>

            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input" required>
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.nombre}</option>
              ))}
            </select>

            <div className="text-center">
              <button type="button" onClick={() => setStep(2)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md">
                Siguiente
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" className="input" required />
            <select value={abierto} onChange={(e) => setAbierto(e.target.value === 'true')} className="input" required>
              <option value="">¿Está abierto?</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
            <input type="text" value={horario} onChange={(e) => setHorario(e.target.value)} placeholder="Horario" className="input" required />
            <input type="text" value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} placeholder="Etiquetas separadas por coma" className="input" />
            <input type="text" value={servicios} onChange={(e) => setServicios(e.target.value)} placeholder="Servicios separados por coma" className="input" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="file" name="imagen" accept="image/*" onChange={handleImageChange} className="file-input" />
              <input type="file" name="logo_imagen" accept="image/*" onChange={handleImageChange} className="file-input" />
              <input type="file" name="imagen_banner" accept="image/*" multiple onChange={handleImageChange} className="file-input" />
            </div>

            <div className="flex justify-between mt-6">
              <button type="button" onClick={() => setStep(1)} className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md">
                Anterior
              </button>
              <button type="submit" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md">
                Crear Negocio
              </button>
            </div>
          </>
        )}
      </form>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Elige una ubicación en el mapa
                </Dialog.Title>
                <div className="mt-4">
                {isOpen && (
  <MapContainer
    center={[-12.0464, -77.0428]}
    zoom={13}
    scrollWheelZoom={true}
    style={{ height: "400px", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    <LocationMarker setLatitud={setLatitud} setLongitud={setLongitud} closeModal={closeModal} />
  </MapContainer>
)}
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CrearNegocio;
