import React from 'react'
import 'animate.css';
import './About.css'

export default function About() {
  return (
    <section className="container animate__animated animate__backInDown">

    <div className="img1"><img src="src/assets/img1.png" alt=""/></div>
    <div className="img2"><img src="/src/assets/img2.png" alt="" /></div>
    <div className="pixel-play-letras"><img src="src/assets/pixelPlayLetras.webp" alt="PixelPlay logo letras" /></div>
    <div className="pixel-play-logo"><img src="/LogoPixelPlay.png" alt="Pixelplay logo"/></div>

        <div className="quienesSomos">
            <h2>Quiénes Somos</h2>
            <p>Somos una tienda apasionada por los videojuegos, ofreciendo los mejores títulos y accesorios para los gamers.</p>
        </div>
        
        <div className="mision">
            <h2>Misión</h2>
            <p>Nuestra misión es ofrecer a la comunidad gamer una experiencia única y completa, brindando acceso a los mejores videojuegos y accesorios con la mejor calidad y precios competitivos. Nos comprometemos a proporcionar un servicio eficiente, seguro y confiable, garantizando la satisfacción de nuestros clientes.</p>
        </div>
        
        <div className="vision">
            <h2>Visión</h2>
            <p>Ser la tienda de referencia para gamers, proporcionando lo último en tecnología y entretenimiento.</p>
        </div>
    </section>
  )
}
