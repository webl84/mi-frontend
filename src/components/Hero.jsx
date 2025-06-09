import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-local-home h-[738px] overflow-hidden">
      <div className="hero-local-content"> 
        <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Descubre y comparte los mejores negocios de tu ciudad
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Explora reseñas auténticas, apoya emprendimientos locales y encuentra tu nuevo lugar favorito.
        </p>
        <Link to="/negocios" className="bg-blue-600 inline-block text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition duration-300">
          Comienza a explorar
        </Link>
      </div>
      </div>
      {/* Imagen decorativa opcional */}
      <img
        src="https://s3-media0.fl.yelpcdn.com/educatorphoto/Ka8dK2VhzdaN2UNNNAJHEA/o.jpg"
        alt="Mapa o ilustración"
        className="img-hero right-0 bottom-0 w-1/6 md:block h-full object-contain"
      />
    </section>
  );
};

export default Hero;
