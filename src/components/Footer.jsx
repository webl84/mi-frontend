// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer style={{ padding: "20px", backgroundColor: "#f7f7f7", textAlign: "center" }}>
      <div className="container-footer"><p>&copy; 2025 Mi Plataforma de Reseñas. Todos los derechos reservados.</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><a href="/terminos" style={{ color: "#007bff", textDecoration: "none" }}>Términos de servicio</a></li>
        <li><a href="/politica-privacidad" style={{ color: "#007bff", textDecoration: "none" }}>Política de privacidad</a></li>
      </ul></div>
    </footer>
  );
};

export default Footer;
