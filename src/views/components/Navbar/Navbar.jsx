import React from 'react'
import { useState, useEffect } from 'react'
import ShoppingCart from '../../../assets/icons/ShoppingCart'
import HeartIcon from '../../../assets/icons/HeartIcon'
import UserIcon from '../../../assets/icons/UserIcon'
import './navbar.css'
import { Link, NavLink} from "react-router-dom"


function Navbar({ isLoggedIn, handleLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [widthSize, setWidthSize] = useState(window.innerWidth);
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

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
    <section className="logonavbar">
        <Link to="/"><img src={widthSize >= 1060 ? "./src/assets/PixelPlay.png": "./src/assets/LogoPixelPlay.webp"} alt="" /></Link>    
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
            <ShoppingCart/>
            <HeartIcon className="heartIcon"/>
            <ShoppingCart className="shoppingCart"/>
            <UserIcon className="userIcon"/>
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
  )
}
export default Navbar;

