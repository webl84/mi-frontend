import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; // Aquí importa el archivo CSS donde están las directivas de Tailwind
import App from './App.jsx' 
import 'leaflet/dist/leaflet.css';

// Arreglar error "global is not defined"
if (typeof global === 'undefined') {
  window.global = window;
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
