import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(err => console.error('Error al cargar el producto:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!producto) return <p>No se encontró el producto.</p>;

  return (
    <div className="max-w-md mx-auto border p-6 rounded shadow">
      <Link to="/" className="text-blue-500 underline mb-4 inline-block">← Volver a la lista</Link>
      <h1 className="text-2xl font-bold">{producto.nombre}</h1>
      <p className="mt-2"><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Descripción:</strong> {producto.descripcion}</p>
      <p><strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}</p>
    </div>
  );
};

export default DetalleProducto;
