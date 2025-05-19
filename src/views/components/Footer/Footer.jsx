import React from "react";
import "./Footer.css";
import FacebookIcon from "../../../assets/icons/FacebookIcon";
import InstagramIcon from "../../../assets/icons/InstagramIcon";
import TwitterIcon from "../../../assets/icons/XIcon";

export default function Footer() {
  return (
    <footer>
      <div className="cta-section" data-fade>
        <h2>¿Listo para la aventura?</h2>
        <p>
          Explora nuestras categorías y descubre lo último en videojuegos y
          accesorios.
        </p>
        <a href="#">Ir a la Tienda</a>
      </div>

      <p>© 2025 Tienda de Videojuegos. Todos los derechos reservados.</p>
      <div className="social-links">
        <a href="#">
          <FacebookIcon />
        </a>
        <a href="#" title="Twitter">
          <TwitterIcon />
        </a>
        <a href="#" title="Instagram">
          <InstagramIcon />
        </a>
      </div>
    </footer>
  );
}
