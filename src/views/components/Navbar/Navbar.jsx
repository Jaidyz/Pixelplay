import { useState, useEffect, useRef } from "react";
import ShoppingCart from "../../../assets/icons/ShoppingCart";
import HeartIcon from "../../../assets/icons/HeartIcon";
import UserIcon from "../../../assets/icons/UserIcon";
import "./navbar.css";
import {CircleUserRound} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function Navbar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Determina si el usuario está autenticado
  const isLoggedIn = !!session;

  useEffect(() => {
    const handleResize = () => {
      setWidthSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [widthSize]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const [vermenu, setvermenu] = useState(null);
  const [verCarito, setVerCarrito] = useState(null);
  const abrirMenuUsuario = () => {
    setvermenu(!vermenu);
  };
  const abrirMenuCarrito = () => {
    setVerCarrito(!verCarito);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <section className="logonavbar">
          <Link to="/">
            <img
              src={
                widthSize >= 1060
                  ? "./src/assets/PixelPlay.png"
                  : "./src/assets/LogoPixelPlay.webp"
              }
              alt=""
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
            <>
              <div className="usuario-info-logged">
                <HeartIcon className="heartIcon" />
                <ShoppingCart className="shoppingCart" />
                <UserIcon className="userIcon" onClick={abrirMenuUsuario} />
              </div>
            </>
          ) : (
            <>
              <div className="usuario-info-not-logged">
                <Link to="/login">Iniciar Sesion</Link>
              </div>
            </>
          )}
        </section>
      </nav>
      {vermenu && (
        <div className="overlay" onClick={() => setvermenu(false)}></div>
      )}
      <div className={`sidebar ${vermenu ? "open" : ""}`}>
        <div className="usario-info">
          {session?.user?.user_metadata?.displayName && (
            <p>Hola, <strong>{session.user.user_metadata.displayName}!</strong></p>
          )}
        </div>
          <p>¡Bienvenido a PixelPlay!</p>
          <section className="opciones">
            <div>Configuraciones</div>
            <div onClick={handleLogout}>Cerrar Sesión</div>
            <div></div>
          </section>
      </div>
    </>
  );
}
export default Navbar;
