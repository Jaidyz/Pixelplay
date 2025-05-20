import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ShoppingCart from "../../../assets/icons/ShoppingCart";
import HeartIcon from "../../../assets/icons/HeartIcon";
import UserIcon from "../../../assets/icons/UserIcon";
import { useAuth } from "../../../context/AuthContext";
import logoDesktop from "/PixelPlay.png";
import logoMobile from "/LogoPixelPlay.png";

import { supabase } from "../../../../supabase/supabase.config";
import "./navbar.css";

function Navbar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [widthSize, setWidthSize] = useState(window.innerWidth);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const [showFavoritesMenu, setShowFavoritesMenu] = useState(false);

  const [favoriteItems, setFavoriteItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const isLoggedIn = !!session;

  useEffect(() => {
    const handleResize = () => setWidthSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => {
      if (!prev) {
        setShowCartMenu(false);
        setShowFavoritesMenu(false);
      }
      return !prev;
    });
  };

  const toggleCartMenu = () => {
    setShowCartMenu((prev) => {
      if (!prev) {
        setShowUserMenu(false);
        setShowFavoritesMenu(false);
      }
      return !prev;
    });
  };

  const toggleFavoritesMenu = () => {
    setShowFavoritesMenu((prev) => {
      if (!prev) {
        setShowUserMenu(false);
        setShowCartMenu(false);
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (showFavoritesMenu && session?.user?.id) {
      async function fetchFavorites() {
        const { data, error } = await supabase
          .from("lista_deseos")
          .select("id, producto_id, producto:productos(nombre, img_url)")
          .eq("usuario_id", session.user.id);
        if (error) {
          console.error("Error al obtener lista de deseos:", error);
        } else {
          setFavoriteItems(data);
        }
      }
      fetchFavorites();
    }
  }, [showFavoritesMenu, session]);

  useEffect(() => {
    if (showCartMenu && session?.user?.id) {
      async function fetchCart() {
        const { data: pedido, error: pedidoError } = await supabase
          .from("pedidos")
          .select("id")
          .eq("usuario_id", session.user.id)
          .eq("estado", "carrito")
          .single();

        if (pedidoError) {
          console.error("Error al obtener el carrito:", pedidoError);
          setCartItems([]);
          return;
        }

        if (pedido) {
          const { data: detalles, error: detallesError } = await supabase
            .from("detalles_pedido")
            .select("id, producto_id, producto:productos(nombre, img_url)")
            .eq("pedido_id", pedido.id);

          if (detallesError) {
            console.error(
              "Error al obtener detalles del carrito:",
              detallesError
            );
            setCartItems([]);
          } else {
            setCartItems(detalles);
          }
        } else {
          setCartItems([]);
        }
      }
      fetchCart();
    }
  }, [showCartMenu, session]);

  const handleRemoveFavorite = async (id) => {
    try {
      const { error } = await supabase
        .from("lista_deseos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar de lista de deseos:", error);
      } else {
        setFavoriteItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar de lista de deseos:", error);
    }
  };

  const handleRemoveCartItem = async (id) => {
    try {
      const { error } = await supabase
        .from("detalles_pedido")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar ítem del carrito:", error);
      } else {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar ítem del carrito:", error);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <section className="logonavbar">
          <Link to="/">
            <img
              src={widthSize >= 1060 ? logoDesktop : logoMobile}
              alt="Logo de PixelPlay"
            />
          </Link>
        </section>
        <section className="menu">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/videojuegos">Videojuegos</NavLink>
          <NavLink to="/accesorios">Accesorios</NavLink>
        </section>
        <section className="usuario">
          {isLoggedIn ? (
            <div className="usuario-info-logged">
              <HeartIcon className="heartIcon" onClick={toggleFavoritesMenu} />
              <ShoppingCart className="shoppingCart" onClick={toggleCartMenu} />
              <UserIcon className="userIcon" onClick={toggleUserMenu} />
            </div>
          ) : (
            <div className="usuario-info-not-logged">
              <Link to="/login">Iniciar Sesión</Link>
            </div>
          )}
        </section>
      </nav>

      {/* Overlay para cerrar menús */}
      {(showUserMenu || showCartMenu || showFavoritesMenu) && (
        <div
          className="overlay"
          onClick={() => {
            setShowUserMenu(false);
            setShowCartMenu(false);
            setShowFavoritesMenu(false);
          }}
        ></div>
      )}

      {/* Menú de Usuario */}
      {showUserMenu && (
        <div className="sidebar user-menu open">
          <div className="usuario-info">
            <p>
              Hola, <strong>{session.user.user_metadata.displayName}!</strong>
            </p>
          </div>
          <section className="opciones">
            <p>¡Bienvenido a PixelPlay!</p>
            <div>Configuraciones</div>
            <div onClick={handleLogout}>Cerrar Sesión</div>
          </section>
        </div>
      )}

      {/* Panel de Lista de Deseos */}
      {showFavoritesMenu && (
        <div className="sidebar favorites-menu open">
          <div className="menu-header">
            <h3>Lista de Deseos</h3>
            <button
              onClick={() => setShowFavoritesMenu(false)}
              aria-label="Cerrar lista de deseos"
            >
              ✕
            </button>
          </div>
          <div className="menu-content">
            {favoriteItems && favoriteItems.length > 0 ? (
              favoriteItems.map((item, index) => (
                <div key={item.id || index} className="item-card">
                  <img
                    src={item.producto?.img_url || "/assets/default-image.png"}
                    alt={item.producto?.nombre || "Producto sin nombre"}
                  />
                  <p>{item.producto?.nombre || "Sin nombre"}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFavorite(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              ))
            ) : (
              <p>No tienes productos en tu lista de deseos.</p>
            )}
          </div>
        </div>
      )}

      {/* Panel del Carrito */}
      {showCartMenu && (
        <div className="sidebar cart-menu open">
          <div className="menu-header">
            <h3>Carrito</h3>
            <button
              onClick={() => setShowCartMenu(false)}
              aria-label="Cerrar carrito"
            >
              ✕
            </button>
          </div>
          <div className="menu-content">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={item.id || index} className="item-card">
                  <img
                    src={item.producto?.img_url || "/assets/default-image.png"}
                    alt={item.producto?.nombre || "Producto sin nombre"}
                  />
                  <p>{item.producto?.nombre || "Sin nombre"}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveCartItem(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              ))
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
