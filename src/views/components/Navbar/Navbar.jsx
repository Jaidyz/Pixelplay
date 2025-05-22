
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ShoppingCart from "../../../assets/icons/ShoppingCart";
import HeartIcon from "../../../assets/icons/HeartIcon";
import UserIcon from "../../../assets/icons/UserIcon";
import { useAuth } from "../../../context/AuthContext";
import logoDesktop from "/PixelPlay.png";
import logoMobile from "/LogoPixelPlay.png";
import { supabase } from "../../../../supabase/supabase.config";
import Swal from "sweetalert2";
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
        fetchCart();
      }
      return !prev;
    });
  };

  const toggleFavoritesMenu = () => {
    setShowFavoritesMenu((prev) => {
      if (!prev) {
        setShowUserMenu(false);
        setShowCartMenu(false);
        fetchFavorites();
      }
      return !prev;
    });
  };

  const fetchFavorites = async () => {
    if (session?.user?.id) {
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
  };

  const fetchCart = async () => {
    if (session?.user?.id) {
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .select("id")
        .eq("usuario_id", session.user.id)
        .eq("estado", "carrito")
        .single();

      if (pedidoError || !pedido) {
        setCartItems([]);
        return;
      }

      const { data: detalles, error: detallesError } = await supabase
        .from("detalles_pedido")
        .select(
          "id, producto_id, cantidad, precio_unitario, producto:productos(nombre, img_url)"
        )
        .eq("pedido_id", pedido.id);

      if (detallesError) {
        console.error("Error al obtener detalles del carrito:", detallesError);
        setCartItems([]);
      } else {
        setCartItems(detalles);
      }
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
      fetchCart();
    }
  }, [session]);

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
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Producto eliminado de la lista de deseos.",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          customClass: { popup: "mini-toast" },
        });
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
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Producto eliminado del carrito.",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          customClass: { popup: "mini-toast" },
        });
      }
    } catch (error) {
      console.error("Error al eliminar ítem del carrito:", error);
    }
  };

  // Calcular total acumulado del carrito
  const totalPrecioCarrito = cartItems.reduce(
    (acc, item) => acc + item.cantidad * item.precio_unitario,
    0
  );

  // Función para iniciar el checkout usando Stripe
const handleCheckout = async () => {
  try {
    const amountInCents = Math.round(totalPrecioCarrito * 100);
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 
    const response = await fetch(
      "https://taiktrpdbskorwsikmbc.supabase.co/functions/v1/crear-checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`, 
        },
        body: JSON.stringify({ amount: amountInCents }),
        mode: "cors",
      }
    );

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("No se recibió la URL de la sesión:", data);
    }
  } catch (error) {
    console.error("Error al iniciar el checkout:", error);
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
              <div className="icon-container" onClick={toggleFavoritesMenu}>
                <HeartIcon className="heartIcon" />
                {favoriteItems && favoriteItems.length > 0 && (
                  <span className="badge">{favoriteItems.length}</span>
                )}
              </div>
              <div className="icon-container" onClick={toggleCartMenu}>
                <ShoppingCart className="shoppingCart" />
                {cartItems && cartItems.length > 0 && (
                  <span className="badge">
                    {cartItems.reduce((acc, item) => acc + (item.cantidad || 1), 0)}
                  </span>
                )}
              </div>
              <div className="icon-container" onClick={toggleUserMenu}>
                <UserIcon className="userIcon" />
              </div>
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
            <div>
              <Link to="adminpanel">Admin panel</Link>
            </div>
            <div onClick={handleLogout}>Configuración</div>
            <div onClick={handleLogout}>Cerrar Sesión</div>
          </section>
        </div>
      )}

      {/* Panel de Lista de Deseos */}
      {showFavoritesMenu && (
        <div className="sidebar favorites-menu open">
          <div className="menu-header">
            <h3>Lista de Deseos</h3>
            <button onClick={() => setShowFavoritesMenu(false)} aria-label="Cerrar lista de deseos">
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
                  <button className="remove-button" onClick={() => handleRemoveFavorite(item.id)}>
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
            <button onClick={() => setShowCartMenu(false)} aria-label="Cerrar carrito">
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
                  <div className="item-info">
                    <span className="item-name">
                      {item.producto?.nombre || "Sin nombre"}
                    </span>
                    <span className="item-quantity">Cantidad: {item.cantidad}</span>
                    <span className="item-price">
                      Precio: ${(item.cantidad * item.precio_unitario).toFixed(2)}
                    </span>
                  </div>
                  <button className="remove-button" onClick={() => handleRemoveCartItem(item.id)}>
                    Quitar
                  </button>
                </div>
              ))
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
            {cartItems && cartItems.length > 0 && (
              <div className="cart-summary">
                <strong>Total:</strong> ${totalPrecioCarrito.toFixed(2)}
                <p></p>
                <button className="checkout-button" onClick={handleCheckout}>
                  Pagar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
