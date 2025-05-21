import React, { useEffect, useState } from "react";
import Card from "../card/Card";
import "./cards.css";
import { supabase } from "../../../../supabase/supabase.config.jsx";
import Swal from "sweetalert2";

function Cards({ tipo, categoria }) {
  const [productos, setProductos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const getProductos = async () => {
    try {
      const { data, error } = await supabase.from("productos").select("*");
      if (error) {
        console.error("Error al obtener productos:", error);
        return false;
      }
      if (data) {
        setProductos(data);
        return true;
      }
    } catch (exception) {
      console.error("Excepción al obtener productos:", exception);
      return false;
    }
    return false;
  };

  useEffect(() => {
    getProductos();
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
        toast: true, // Para hacerlo tipo toast
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
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Producto agregado al carrito.",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: "mini-toast",
        },
        toast: true, // Para hacerlo tipo toast
      });

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
      console.log("Producto agregado al carrito:", data);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

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
            onAddToCart={() => handleAddToCart(producto.id, producto.precio)}
            onAddToFavorites={() => handleAddToFavorites(producto.id)}
          />
        ))}
      </section>
    </section>
  );
}

export default Cards;
