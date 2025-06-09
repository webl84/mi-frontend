import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AgregarResena from "./pages/AgregarResena";
import PrivateRoute from "./components/PrivateRoute"; // revisa la ruta
import DetalleNegocio from "./components/DetalleNegocio"; 
import RecuperarContrasena from './pages/RecuperarContrasena';
import NuevaContrasena from './pages/NuevaContrasena';
import Registro from './pages/Registro';
import DetalleProducto from './components/DetalleProducto';
import CrearNegocio from './components/CrearNegocio'; 
import EditarNegocio from './components/EditarNegocio';
/*dashboard*/
import DashboardRouter from "./pages/DashboardRouter";
import DashboardUsuario from "./pages/DashboardUsuario";
import DashboardCliente from "./pages/DashboardCliente";
import DashboardAdmin from "./pages/DashboardAdmin"; 
import EditarResena from './components/EditarResena';


import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

import PruebaEstrellas from "./components/PruebaEstrellas";

import PerfilUsuario from './components/PerfilUsuario';

import CategoriaDetalle from './components/CategoriaDetalle';


function App() {
  return (
    <Router>
      <Routes> 
      <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/dashboard/usuario" element={<DashboardUsuario />} />
        <Route path="/dashboard/cliente" element={<DashboardCliente />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      <Route path="/prueba-estrellas" element={<PruebaEstrellas />} />
      <Route path="/editar-negocio/:id" element={<EditarNegocio />} />
      <Route path="/perfil" element={<PerfilUsuario />} />

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Registro />} />
        <Route path="/admin/crear-negocio" element={<CrearNegocio />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} /> 
        <Route path="/recuperar-contrasena/:token" element={<NuevaContrasena />} />
        <Route path="/categorias/:id" element={<CategoriaDetalle />} />
        <Route path="/negocios/:id" element={<DetalleNegocio />} /> {/* Ruta para el detalle del negocio */}
        {/* Usamos el componente PrivateRoute para proteger las rutas internas */}
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/resena/editar/:id" element={<EditarResena />} />

          <Route path="resena/nueva" element={<AgregarResena />} />
          {/* Aquí cambiamos de `component` a `element` */}
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
