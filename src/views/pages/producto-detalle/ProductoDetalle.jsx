import Footer from "./../../components/Footer/Footer";
import Navbar from "./../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/supabase.config.jsx";
import ReactPlayer from "react-player";
import "./Producto-detalle.css";
import ShoppingCart from "../../../assets/icons/ShoppingCart";
import HeartIcon from "../../../assets/icons/HeartIcon";
import Swal from "sweetalert2";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleAddToFavorites = async (productId) => {
    try {
      if (!user?.id) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Inicia sesión para agregar a favoritos.",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "mini-toast",
          },
          toast: true, // Para hacerlo tipo toast
        });
        return;
      }
      const { data, error } = await supabase
        .from("lista_deseos")
        .insert([
          {
            usuario_id: user.id,
            producto_id: productId,
            fecha_agregado: new Date().toISOString(),
          },
        ])
        .select();
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Producto agregado a lista de deseos.",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "mini-toast",
        },
        toast: true,
      });
      if (error) {
        throw error;
      }
      console.log("Producto agregado a lista de deseos:", data);
    } catch (error) {
      console.error("Error al agregar a lista de deseos:", error);
    }
  };

  const handleAddToCart = async (productId, price) => {
    try {
      if (!user?.id) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Inicia sesión para agregar al carrito.",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "mini-toast",
          },
          toast: true, // Para hacerlo tipo toast
        });
        return;
      }

      let { data: pedidoExistente, error: pedidoError } = await supabase
        .from("pedidos")
        .select("*")
        .eq("usuario_id", user.id)
        .eq("estado", "carrito")
        .maybeSingle();
      if (pedidoError) {
        throw pedidoError;
      }

      let pedido_id;
      if (!pedidoExistente) {
        const { data: nuevoPedido, error: nuevoPedidoError } = await supabase
          .from("pedidos")
          .insert([
            {
              usuario_id: user.id,
              fecha: new Date().toISOString(),
              total: price,
              estado: "carrito",
            },
          ])
          .select()
          .single();
        if (nuevoPedidoError) {
          throw nuevoPedidoError;
        }
        pedido_id = nuevoPedido.id;
      } else {
        pedido_id = pedidoExistente.id;
      }

      const { data, error } = await supabase
        .from("detalles_pedido")
        .insert([
          {
            pedido_id: pedido_id,
            producto_id: productId,
            cantidad: 1,
            precio_unitario: price,
          },
        ])
        .select();

      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Producto agregado al carrito.",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "mini-toast",
        },
        toast: true,
      });
      if (error) {
        throw error;
      }
      console.log("Producto agregado al carrito:", data);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Cargando producto...</p>;

  return (
    <>
      <Navbar />
      <section className="contenedorProductoDetalle">
        <article className="trailer-container">
          {producto.trailer_url ? (
            <>
              <h2>Trailer</h2>
              <section className="trailer">
                <ReactPlayer url={producto.trailer_url} controls />
              </section>
            </>
          ) : (
            <>
              <h2>Imagen</h2>
              <section className="trailer">
                <img src={producto.img_url} alt={producto.nombre} />
              </section>
            </>
          )}
          <h2>Descripción</h2>
          <p>{producto.descripcion}</p>
        </article>
        <section className="contenido">
          <h1>{producto.nombre}</h1>
          <img src={producto.img_url} alt={producto.name} />
          <h2>{producto.precio}</h2>
          <div className="botones">
            <button onClick={() => handleAddToCart(id, producto.precio)}>
              <ShoppingCart />
              <p>Agregar al carrito</p>
            </button>
            <button onClick={() => handleAddToFavorites(id)}>
              <HeartIcon />
              <p>Agregar a favoritos</p>
            </button>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default ProductoDetalle;
