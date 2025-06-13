import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://mi-backend-tz1u.onrender.com/api/usuarios/login",
        {
          email: formData.email,
          contraseña: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      const { token,rol} = response.data; 

      localStorage.setItem('token', token); // Guarda el token


      // Redirecciona según el rol del usuario
      if (rol === "admin") {
        navigate("/dashboard/admin");
      } else if (rol === "cliente") {
        navigate("/dashboard/cliente");
      } else {
        navigate("/dashboard/usuario");
      }
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace para recuperar la contraseña */}
        <div className="mt-4">
          <a
            href="/recuperar-contrasena"
            className="text-blue-500 hover:text-blue-700"
          >
            ¿Olvidaste tu contraseña?
          </a>
          <p className="mt-4 text-sm">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
