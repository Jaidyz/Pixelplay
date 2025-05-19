import React from 'react';
import 'animate.css';
import './About.css';

export default function About() {
  return (
    <section className="about-container">
      {/* Video de fondo con estética cyberpunk */}
      <video autoPlay loop muted className="background-video">
        <source src="src/assets/video_fondo.mp4" type="video/mp4" />
        Tu navegador no soporta el video HTML5.
      </video>

      {/* Contenido principal */}
      <div className="content">
        <div className="img1 animate__animated animate__fadeInRight">
          <img src="src/assets/img1.png" alt="Imagen 1" />
        </div>
        <div className="img2 animate__animated animate__fadeInLeft">
          <img src="src/assets/img2.png" alt="Imagen 2" />
        </div>
        <div className="pixel-play-letras animate__animated animate__zoomIn">
          <img src="src/assets/pixelPlayLetras.webp" alt="PixelPlay logo letras" />
        </div>
        <div className="pixel-play-logo animate__animated animate__zoomIn">
          <img src="/LogoPixelPlay.png" alt="PixelPlay logo" />
        </div>

        <div className="quienesSomos animate__animated animate__fadeInUp">
          <h2>Quiénes Somos</h2>
          <p>
            Somos una tienda apasionada por los videojuegos, ofreciendo los mejores títulos y accesorios para los gamers.
          </p>
        </div>

        <div className="mision animate__animated animate__fadeInUp">
          <h2>Misión</h2>
          <p>
            Nuestra misión es ofrecer a la comunidad gamer una experiencia única y completa, brindando acceso a los mejores videojuegos y accesorios con la mejor calidad y precios competitivos. Nos comprometemos a proporcionar un servicio eficiente, seguro y confiable, garantizando la satisfacción de nuestros clientes.
          </p>
        </div>

        <div className="vision animate__animated animate__fadeInUp">
          <h2>Visión</h2>
          <p>
            Ser la tienda de referencia para gamers, proporcionando lo último en tecnología y entretenimiento.
          </p>
        </div>
      </div>
    </section>
  );
}
