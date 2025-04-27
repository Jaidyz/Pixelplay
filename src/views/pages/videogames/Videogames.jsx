import React from "react";
import "./Videogames.css";
import Cards from "../../components/cards/Cards";

export default function Videogames() {
  return (
    <>
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
    </>

  );
}
