import React from 'react'
import './About.css'

export default function About() {
  return (
    <section className="container">

    <div className="img1"><img src="src/assets/img1.png" alt=""/></div>
    <div className="img2"></div>
    <div className="img3"></div>
    <div className="img4"><img src="/LogoPixelPlay.png" alt=""/></div>

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
