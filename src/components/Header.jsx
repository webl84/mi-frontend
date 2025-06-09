import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [usuario, setUsuario] = useState(null);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);
  const navigate = useNavigate();
  const submenuRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem("usuarioId") || getCookie("usuarioId");
    if (id) {
      axios
        .get(`http://localhost:5000/api/usuarios/perfil/${id}`)
        .then((res) => {
          setUsuario({ ...res.data, id });
        })
        .catch((err) => {
          console.error("Error cargando perfil:", err);
        });
    }
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioId");
    document.cookie = "usuarioId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUsuario(null);
    navigate("/");
  };

  const irADashboard = () => {
    if (!usuario?.rol) return;
    if (usuario.rol === "admin") navigate("/dashboard/admin");
    else if (usuario.rol === "cliente") navigate("/dashboard/cliente");
    else navigate("/dashboard/usuario");
  };

  // Para cerrar el submenu al hacer click fuera
  useEffect(() => {
    const handleClickFuera = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setSubmenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => {
      document.removeEventListener("mousedown", handleClickFuera);
    };
  }, []);

  return (
    <header className="bg-gray-100 shadow-md py-4 px-6 header-bg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 mb-2 md:mb-0 logo">
          <img src="/images/logo-localik.png" className="h-10" alt="Logo" />
        </Link>

        {/* Navegación */}
        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium items-center">
            <li>
              <Link to="/" className="hover:text-blue-600 transition">
                Locally para negocios
              </Link>
            </li>
            <li>
              <Link to="/resena/nueva" className="hover:text-blue-600 transition">
                Escribe una reseña
              </Link>
            </li>

            {usuario ? (
              <li
                ref={submenuRef}
                className="item-menu relative cursor-pointer select-none"
                onMouseEnter={() => setSubmenuAbierto(true)}
                onMouseLeave={() => setSubmenuAbierto(false)}
              >
                <div
                  className="flex items-center space-x-2"
                  onClick={() => setSubmenuAbierto(!submenuAbierto)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border">
                    <img
                      src={
                        usuario.foto
                          ? usuario.foto.startsWith("http")
                            ? usuario.foto
                            : `http://localhost:5000/${usuario.foto.replace(/^\/+/, "")}`
                          : usuario.avatar
                          ? usuario.avatar
                          : `https://api.dicebear.com/7.x/micah/svg?seed=${usuario.id}`
                      }
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{usuario.nombre}</span>
                </div>

                <ul
                  className={`
                    submenu absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 transition-opacity duration-200
                    
                  `}
                >
                  <li>
                    <Link to="/perfil" className="block px-4 py-2 hover:bg-gray-100">
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={irADashboard}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn-login hover:text-blue-600 transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn-registro hover:text-blue-600 transition">
                    Registro
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
