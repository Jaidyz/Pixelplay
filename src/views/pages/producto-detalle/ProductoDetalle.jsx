import Footer from "./../../components/Footer/Footer";
import Navbar from "./../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "./producto-detalle.css";
import ShoppingCart from "../../../assets/icons/ShoppingCart";
import HeartIcon from "../../../assets/icons/HeartIcon";
import Resenas from "../../components/reseñas/Resenas.jsx";
import "animate.css";
import Swal from "sweetalert2";
import { supabase } from "../../../../supabase/supabase.config.jsx";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Mostrar alertas con Swal
  const showAlert = (type, message) => {
    Swal.fire({
      position: "bottom-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 1500,
      customClass: { popup: "mini-toast" },
      toast: true,
    });
  };

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) setError(error.message);
      else setProducto(data);
    }
    fetchData();
  }, [id]);

  // Agregar a favoritos con verificación de duplicados
  const handleAddToFavorites = async (productId) => {
    if (!user?.id) {
      showAlert("error", "Inicia sesión para agregar a favoritos.");
      return;
    }

    const { data: existingFav, error: favError } = await supabase
      .from("lista_deseos")
      .select("*")
      .eq("usuario_id", user.id)
      .eq("producto_id", productId)
      .maybeSingle();

    if (favError) return console.error("Error al verificar favoritos:", favError);
    if (existingFav) {
      showAlert("info", "El producto ya está en tu lista de deseos.");
      return;
    }

    const { error } = await supabase
      .from("lista_deseos")
      .insert([{ usuario_id: user.id, producto_id: productId, fecha_agregado: new Date().toISOString() }]);

    if (error) return console.error("Error al agregar a favoritos:", error);
    showAlert("success", "Producto agregado a lista de deseos.");
  };

  // Agregar al carrito con verificación y actualización de cantidad
  const handleAddToCart = async (productId, price) => {
    if (!user?.id) {
      showAlert("error", "Inicia sesión para agregar al carrito.");
      return;
    }

    let { data: pedidoExistente } = await supabase
      .from("pedidos")
      .select("*")
      .eq("usuario_id", user.id)
      .eq("estado", "carrito")
      .maybeSingle();

    let pedido_id = pedidoExistente ? pedidoExistente.id : null;

    if (!pedido_id) {
      const { data: nuevoPedido, error: nuevoPedidoError } = await supabase
        .from("pedidos")
        .insert([{ usuario_id: user.id, fecha: new Date().toISOString(), total: price, estado: "carrito" }])
        .select()
        .single();
      if (nuevoPedidoError) return console.error("Error al crear pedido:", nuevoPedidoError);
      pedido_id = nuevoPedido.id;
    }

    const { data: existingDetail } = await supabase
      .from("detalles_pedido")
      .select("*")
      .eq("pedido_id", pedido_id)
      .eq("producto_id", productId)
      .maybeSingle();

    if (existingDetail) {
      await supabase
        .from("detalles_pedido")
        .update({ cantidad: existingDetail.cantidad + 1 })
        .eq("id", existingDetail.id);
      showAlert("success", "Cantidad actualizada en el carrito.");
    } else {
      await supabase
        .from("detalles_pedido")
        .insert([{ pedido_id, producto_id: productId, cantidad: 1, precio_unitario: price }]);
      showAlert("success", "Producto agregado al carrito.");
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!producto)
    return (
      <div className="cargando-producto-detalle">
        {" "}
        <p className=" animate__animated animate__flash">
          Cargando producto...
        </p>
      </div>
    );

  return (
    <>
      <Navbar />
      <section className="contenedorProductoDetalle">
        <article className="trailer-container">
          {producto.trailer_url ? (
            <>
              <h2>Trailer</h2>
              <section className="trailer">
                <ReactPlayer url={producto.trailer_url} controls width={"auto"} height={"280px"} />
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
      <section className="reseñas">
        <Resenas />
      </section>
      <Footer />
    </>
  );
}

export default ProductoDetalle;
