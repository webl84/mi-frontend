import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono personalizado
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function LocationMarker({ setLatitud, setLongitud, closeModal }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
    },
  });

  const handleConfirmLocation = () => {
    if (position) {
      closeModal();
    }
  };

  return position ? (
    <Marker position={position} icon={markerIcon}>
      <Popup>
        Latitud: {position.lat.toFixed(5)}, Longitud: {position.lng.toFixed(5)}
        <br />
        <button onClick={handleConfirmLocation} className="mt-2 p-1 bg-blue-500 text-white rounded">
          Usar esta ubicación
        </button>
      </Popup>
    </Marker>
  ) : null;
}

export function MapaModal({ isOpen, closeModal, setLatitud, setLongitud }) {
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        {isOpen && (
          <MapContainer
            center={[-12.0464, -77.0428]} // Centro en Lima
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100%" }} // 🔥 Tamaño fijo para que no demore
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" // 🔥 Tiles más rápidos
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker setLatitud={setLatitud} setLongitud={setLongitud} closeModal={closeModal} />
          </MapContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
