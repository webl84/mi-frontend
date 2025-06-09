import { useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';

const LocationMarker = ({ setLatitud, setLongitud }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLatitud(lat);  // Actualiza la latitud
      setLongitud(lng); // Actualiza la longitud
    },
  });

  useEffect(() => {
    if (setLatitud && setLongitud) {
      const marker = L.marker([setLatitud, setLongitud]).addTo(map);
      marker.bindPopup('Ubicación seleccionada');
    }
  }, [setLatitud, setLongitud, map]);

  return null; // Este componente no necesita renderizar nada
};

export default LocationMarker;
