// src/config/axiosConfig.js
import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create({
  baseURL: 'https://mi-backend-tz1u.onrender.com/api', // Aquí va la URL base de tu API
  // Otros ajustes globales si es necesario
});

// Configurar el interceptor de errores para evitar el registro en consola
axiosInstance.interceptors.response.use(
  response => response, // Si la respuesta es correcta, solo la retorna
  error => {
    // Maneja los errores aquí sin que se impriman en la consola
    if (error.response) {
      // El error se recibió del servidor (código de error 4xx o 5xx)
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La solicitud se hizo, pero no hubo respuesta (posible error de red)
      return Promise.reject({ message: 'Error de red. Intenta nuevamente.' });
    } else {
      // Algo pasó al configurar la solicitud
      return Promise.reject({ message: 'Error desconocido.' });
    }
  }
);

export default axiosInstance;
