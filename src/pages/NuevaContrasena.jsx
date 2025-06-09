import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const NuevaContrasena = () => {
  const { token } = useParams();
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://mi-backend-tz1u.onrender.com/api/usuarios/nueva-contrasena', {
        token,
        nuevaContrasena
      });
      setMensaje(response.data.message);
    } catch (error) {
      setMensaje(error.response.data.message || 'Error al cambiar la contraseña');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Cambiar contraseña
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
};

export default NuevaContrasena;
