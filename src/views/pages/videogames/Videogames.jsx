import React, { useState } from "react";
import "./videogames.css";
import Cards from "../../components/cards/Cards";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import Slider from "../../components/slider/Slider";

export default function Videogames() {
  const [categoria, setCategoria] = useState("");

  const handleCategoriaClick = (nuevaCategoria, e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del enlace
    setCategoria(nuevaCategoria);
  };

  return (
    <>
      <Navbar />
      <Slider />
      <section className="contenedor">
        <section className="contenedor-categorias">
          <h2>Categorías</h2>
          <section className="categorias">
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("Acción-Aventura", e)}
              className={categoria === "Acción-Aventura" ? "activo" : ""}
            >
              Acción
            </a>
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("Aventura", e)}
              className={categoria === "Aventura" ? "activo" : ""}
            >
              Aventura
            </a>
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("RPG", e)}
              className={categoria === "RPG" ? "activo" : ""}
            >
              RPG
            </a>
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("Terror", e)}
              className={categoria === "Terror" ? "activo" : ""}
            >
              Terror
            </a>
                        <a
              href="#"
              onClick={(e) => handleCategoriaClick("Deportes", e)}
              className={categoria === "Deportes" ? "activo" : ""}
            >
              Deportes
            </a>
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("", e)}
              className={categoria === "" ? "activo" : ""}
            >
              Todos
            </a>
          </section>
        </section>
        <Cards tipo="videojuego" categoria={categoria} />
      </section>
      <Footer />
    </>
  );
}
