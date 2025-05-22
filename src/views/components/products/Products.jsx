// Products.jsx
import React, { useState, useEffect } from "react";
import Card from "../components/card/Card"; 
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Products = () => {
  const { session } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/productos");  
        if (!res.ok) {
          throw new Error("Error al cargar productos");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToFavorites = async (productId) => {
    try {
      if (!session?.user?.id) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Inicia sesión para agregar a favoritos.",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          customClass: { popup: "mini-toast" }
        });
        return;
      }

      // Consultar si el producto ya está en favoritos vía un endpoint GET
      const checkRes = await fetch(`/api/favoritos?usuario_id=${session.user.id}&producto_id=${productId}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.exists) {
          Swal.fire({
            position: "bottom-end",
            icon: "info",
            title: "El producto ya está en tu lista de deseos.",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            customClass: { popup: "mini-toast" }
          });
          return;
        }
      }

      const response = await fetch("/api/favoritos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: productId,
          usuario_id: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar a favoritos");
      }
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Producto agregado a favoritos.",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "mini-toast" }
      });
      console.log("Producto agregado a favoritos");
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "mini-toast" }
      });
    }
  };

  const handleAddToCart = async (productId, price) => {
    try {
      if (!session?.user?.id) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Inicia sesión para agregar al carrito.",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          customClass: { popup: "mini-toast" }
        });
        return;
      }

      // Verificar si el producto ya está en el carrito vía GET
      const checkRes = await fetch(`/api/carrito?usuario_id=${session.user.id}&producto_id=${productId}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.exists) {
          // Actualizar la cantidad utilizando método PUT
          const updateRes = await fetch("/api/carrito", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              producto_id: productId,
              usuario_id: session.user.id,
              cantidad_delta: 1,
            }),
          });
          if (!updateRes.ok) {
            throw new Error("Error al actualizar el carrito");
          }
          Swal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Cantidad actualizada en el carrito.",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            customClass: { popup: "mini-toast" }
          });
          return;
        }
      }

      // Si no existe, agregar el producto al carrito
      const response = await fetch("/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: productId,
          usuario_id: session.user.id,
          cantidad: 1,
          precio: price,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar al carrito");
      }

      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Producto agregado al carrito.",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "mini-toast" }
      });
      console.log("Producto agregado al carrito");
    } catch (error) {
      console.error(error);
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "mini-toast" }
      });
    }
  };

  return (
    <div className="products-container">
      {products.map((product) => (
        <Card
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imgLink={product.imgLink}
          onAddToFavorites={() => handleAddToFavorites(product.id)}
          onAddToCart={() => handleAddToCart(product.id, product.price)}
        />
      ))}
    </div>
  );
};

export default Products;
