import Footer from "./../../components/Footer/Footer";
import Navbar from "./../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/supabase.config.jsx";
import ReactPlayer from "react-player";
import "./producto-detalle.css";
import ShoppingCart from "../../../assets/icons/ShoppingCart";
import HeartIcon from "../../../assets/icons/HeartIcon";
import Swal from "sweetalert2";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Se obtiene el producto según el id
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

  // Se obtiene el usuario activo
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Función para agregar a favoritos (verifica duplicados)
  const handleAddToFavorites = async (productId) => {
    try {
      if (!user?.id) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Inicia sesión para agregar a favoritos.",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: "mini-toast" },
          toast: true,
        });
        return;
      }

      // Verificar si el producto ya está en la lista de deseos
      const { data: existingFav, error: favError } = await supabase
        .from("lista_deseos")
        .select("*")
        .eq("usuario_id", user.id)
        .eq("producto_id", productId)
        .maybeSingle();

      if (favError) {
        console.error("Error al verificar favoritos:", favError);
        return;
      }

      if (existingFav) {
        Swal.fire({
          position: "bottom-end",
          icon: "info",
          title: "El producto ya está en tu lista de deseos.",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: "mini-toast" },
          toast: true,
        });
        return;
      }

      // Insertar el producto a favoritos
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

      if (error) throw error;

      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Producto agregado a lista de deseos.",
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: "mini-toast" },
        toast: true,
      });
      console.log("Producto agregado a lista de deseos:", data);
    } catch (error) {
      console.error("Error al agregar a lista de deseos:", error);
    }
  };

  // Función para agregar al carrito (verifica si el producto ya existe y actualiza la cantidad)
  const handleAddToCart = async (productId, price) => {
    try {
      if (!user?.id) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Inicia sesión para agregar al carrito.",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: "mini-toast" },
          toast: true,
        });
        return;
      }

      // Se consulta si ya existe un pedido en estado "carrito" para el usuario
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
        // Si no existe, se crea un nuevo pedido
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

      // Verificar si ya existe el producto en los detalles del pedido
      const { data: existingDetail, error: detailError } = await supabase
        .from("detalles_pedido")
        .select("*")
        .eq("pedido_id", pedido_id)
        .eq("producto_id", productId)
        .maybeSingle();

      if (detailError) {
        throw detailError;
      }

      if (existingDetail) {
        // Si existe, se actualiza la cantidad incrementándola
        const { data, error: updateError } = await supabase
          .from("detalles_pedido")
          .update({ cantidad: existingDetail.cantidad + 1 })
          .eq("id", existingDetail.id)
          .select();
        if (updateError) {
          throw updateError;
        }
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Cantidad actualizada en el carrito.",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: "mini-toast" },
          toast: true,
        });
        console.log("Cantidad actualizada en el carrito:", data);
      } else {
        // Si no existe, se inserta el producto en el carrito
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
        if (error) {
          throw error;
        }
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Producto agregado al carrito.",
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: "mini-toast" },
          toast: true,
        });
        console.log("Producto agregado al carrito:", data);
      }
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
          <img src={producto.img_url} alt={producto.nombre} />
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
