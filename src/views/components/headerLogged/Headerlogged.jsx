import React from 'react'
import './headerlogger.css'

export default function Headerlogged() {
  return (
    <nav className="navbar">
    <section className="logo">
        <img src="./src/assets/PixelPlay.png" alt="" />
    </section>
    <section className="menu">
        <a href="#">Inicio</a>
        <a href="#">Videojuegos</a>
        <a href="#">Accesorios</a>
    </section>
    <section className="usuario">
        <a href="#"><button className="button">Cerra sesión</button></a>
    </section>
</nav>
  )
}
