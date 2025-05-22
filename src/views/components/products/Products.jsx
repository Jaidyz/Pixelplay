import React, { useState, useEffect } from "react";
import Card from "../components/card/Card"; 
import { useAuth } from "../../context/AuthContext";

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
      const response = await fetch("/api/favoritos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: productId,
          usuario_id: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar a favoritos");
      }
      console.log("Producto agregado a favoritos");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch("/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          producto_id: productId,
          usuario_id: session?.user?.id,
          cantidad: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar al carrito");
      }
      console.log("Producto agregado al carrito");
    } catch (error) {
      console.error(error);
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
          onAddToFavorites={handleAddToFavorites}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};

export default Products;
