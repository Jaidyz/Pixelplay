import Footer from "./../../components/footer/Footer";
import Navbar from "./../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/supabase.config.jsx";
import ReactPlayer from "react-player";
import "./Producto-detalle.css";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProducto(data);
      }
    };

    fetchProducto();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Cargando producto...</p>;
  return (
    <>
      <Navbar />
      <section className="contenedorProductoDetalle">
        <article className="trailer-container">
            <h2>Trailer</h2>
            <section className="trailer">
              <ReactPlayer url={producto.trailer_url} controls />
          </section>
            <h2>Descripción</h2>
            <p>{producto.descripcion}</p>
        </article>
        <section className="contenido">
            <h1>{producto.nombre}</h1>
            <img src={producto.img_url} alt={producto.name} />
            <h2>{producto.precio}</h2>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default ProductoDetalle;
