// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/verify", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verificarAutenticacion();
  }, []);

  if (isAuthenticated === null) return <p>Cargando...</p>; // mientras verifica

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
