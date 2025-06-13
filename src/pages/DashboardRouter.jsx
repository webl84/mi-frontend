import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashboardRouter() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const usuarioId = document.cookie
          .split('; ')
          .find(row => row.startsWith('usuarioId='))
          ?.split('=')[1];

        if (!usuarioId) {
          return navigate("/login");
        }

        const { data } = await axios.get(`https://mi-backend-tz1u.onrender.com/usuarios/perfil/${usuarioId}`, {
          withCredentials: true,
        });

        switch (data.rol) {
          case "admin":
            navigate("/dashboard/admin");
            break;
          case "cliente":
            navigate("/dashboard/cliente");
            break;
          default:
            navigate("/dashboard/usuario");
        }
      } catch (error) {
        console.error("Error al obtener el perfil", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-20 text-xl">Cargando dashboard...</div>;
  }

  return null;
}

export default DashboardRouter;
