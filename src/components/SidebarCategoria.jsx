import React from 'react';
import SidebarCategoria from './SidebarCategoria'; // Asegúrate de que el path sea correcto

const Layout = ({ negocios }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4">
        <SidebarCategoria negocios={negocios} />
      </div>

      {/* Contenido principal */}
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-semibold">Negocios Sugeridos</h1>
        {/* Aquí puedes agregar otros componentes o vistas */}
      </div>
    </div>
  );
};

export default Layout;
