import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // <-- Importar Link 
import { iconosCategorias,iconoCategoriaGenerico } from '../components/iconosCategorias';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categorias");
        setCategories(response.data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className="seccion-categorias bg-100 py-20">
       <div className="cat-container">
      <h2 className="text-3xl font-bold text-center mb-10">Categorías</h2>
      <div className="listado-cat flex flex-wrap justify-center gap-6">
        {categories.map((category) => {
          const icono = iconosCategorias[category.nombre.toLowerCase()] || iconoCategoriaGenerico;

          return (
            <Link
            to={`/categorias/${category._id}`}
            className="transition-colors inline-block"
          >
            <div key={category._id} className="bg-white shadow-lg rounded-lg p-6 text-center w-60">
              <div className="text-4xl mb-3 flex justify-center">{icono}</div>
              <h3 className="text-xl font-semibold mb-4">{category.nombre}</h3>
            
               
          
            </div>  </Link>
          );
        })}
      </div>  
  </div>
    </section>
  );
};

export default Categories;
