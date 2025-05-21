import {useState} from "react";
import Cards from "../../components/cards/Cards";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

function Accesorios() {
  const [categoria, setCategoria] = useState("");

  const handleCategoriaClick = (nuevaCategoria, e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del enlace
    setCategoria(nuevaCategoria);
  };
  return (
    <>
      <Navbar />
      <section className="contenedor">
        <section className="contenedor-categorias">
          <h2>Categorías</h2>
          <section className="categorias">
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("Monitores", e)}
              className={categoria === "Monitores" ? "activo" : ""}
            >
              Monitores
            </a>
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("Accesorios", e)}
              className={categoria === "Accesorios" ? "activo" : ""}
            >
              Accesorios
            </a>
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("Audio", e)}
              className={categoria === "Audio" ? "activo" : ""}
            >
              Audio
            </a>
            <a
              href="#"
              onClick={(e) => handleCategoriaClick("Periféricos", e)}
              className={categoria === "Periféricos" ? "activo" : ""}
            >
              Periféricos
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
        <Cards tipo={"articulo_gaming" || "general"} categoria={categoria} />
      </section>
      <Footer />
    </>
  );
}

export default Accesorios;
