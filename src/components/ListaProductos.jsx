import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="grid gap-4">
      {productos.map((prod) => (
        <Link to={`/producto/${prod._id}`} key={prod._id} className="block border p-4 rounded shadow hover:bg-gray-100 transition">
          <h2 className="text-lg font-semibold">{prod.nombre}</h2>
          <p>Precio: ${prod.precio}</p>
          <p>Categoría: {prod.categoria?.nombre || 'Sin categoría'}</p>
        </Link>
      ))}
    </div>
  );
};

export default ListaProductos;
