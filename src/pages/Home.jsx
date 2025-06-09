// src/pages/Home.jsx
import React from "react";
import Hero from "../components/Hero";
import Header from "../components/Header";
import Categories from "../components/Categories";
import ListaResenas from "../components/ListaResenas";
import Footer from "../components/Footer";
import ListaNegocios from "../components/ListaNegocios";
// src/components/Home.jsx
import ListaProductos from '../components/ListaProductos';

import PruebaEstrellas from "../components/PruebaEstrellas";



const Home = () => {
    const negocioId = "67f40d3558e992dce3d2374e"; // El ID del negocio que quieres mostrar
  return (
    <div>
      <Header/>
      <Hero /> 
      <ListaResenas negocioId={negocioId} /> {/* Llamamos a Testimonials pasando el negocioId */}
      <Categories />
      {/*<ListaNegocios /> 
      <ListaProductos />*/}
    <Footer />
     
    </div>
  );
};

export default Home;
