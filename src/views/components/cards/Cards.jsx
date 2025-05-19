import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Card from "../card/Card";
import "./cards.css";
import { supabase } from "../../../../supabase/supabase.config.jsx";

function Cards({ tipo, categoria }) {
  const [productos, setProductos] = useState([]);
  const getProductos = async () => {
    try {
      const { data, error } = await supabase.from("productos").select("*");

      if (error) {
        console.error("Error al obtener productos:", error);
        return false; // Indicar que hubo un error
      }

      if (data) {
        setProductos(data); // Actualiza el estado con los productos obtenidos
        return true; // Indicar que la operación fue exitosa
      }
    } catch (exception) {
      console.error("Excepción al obtener productos:", exception);
      return false; // Indicar que hubo una excepción
    }

    return false; // Por si no se cumple ninguna condición anterior
  };

  useEffect(() => {
    getProductos();
  }, []);

  const filteredProducts = productos
    .filter((producto) => (tipo ? producto.tipo_producto === tipo : true))
    .filter((producto) =>
      categoria ? producto.categoria === categoria : true
    );

  return (
    <section className="cards">
      <section className="card-container">
        {filteredProducts.map((producto) => (
          <Card
            key={producto.id}
            id={producto.id}
            name={producto.nombre}
            price={producto.precio}
            imgLink={producto.img_url}
          />
        ))}
      </section>
    </section>
  );
}

export default Cards;
