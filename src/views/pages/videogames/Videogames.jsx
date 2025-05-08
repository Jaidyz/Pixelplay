import React from "react";
import "./Videogames.css";
import Cards from "../../components/cards/Cards";
import Footer from "../../components/footer/Footer"
import Navbar from "../../components/navbar/Navbar"
import Slider from "../../components/slider/Slider";

export default function Videogames() {
  return (
    <>
    <Navbar/>
    <Slider/>
    <section className="contenedor">
    <section className="contenedor-categorias">
      <h2>Categorías</h2>
      <section className="categorias">

      <a href="">Acción</a>
      <a href="">Aventura</a>
      <a href="">RPG</a>
      <a href="">Todos</a>
      </section>
    </section>
      <Cards tipo="videojuego"/>
    </section>
    <Footer/>
    </>

  );
}
