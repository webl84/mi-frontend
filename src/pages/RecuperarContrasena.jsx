import React, { useState } from "react";
import axios from "axios";

function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://mi-backend-tz1u.onrender.com/api/usuarios/recuperar-contrasena", {
        email,
      });
      setMensaje(response.data.message);
      setError("");
    } catch (err) {
      setError("Hubo un error al enviar el correo de recuperación.");
      setMensaje("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Correo electrónico"
            required
          />
        </div>

        {mensaje && <p className="text-green-600">{mensaje}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Enviar correo de recuperación
        </button>
      </form>
    </div>
  );
}

export default RecuperarContrasena;
