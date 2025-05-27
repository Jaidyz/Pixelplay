import { useEffect, useState } from "react";
import "/app.css";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Videogames from "./views/pages/videogames/Videogames";
import Accesorios from "./views/pages/accesorios/Accesorios";
import Register from "./views/pages/login-register/Register";
import Login from "./views/pages/login-register/Login";
import Home from "./views/pages/Home";
import ProductoDetalle from "./views/pages/producto-detalle/ProductoDetalle";
import AdminPanel from "./views/pages/admin-panel/AdminPanel";
import Success from "./views/pages/success/Success";  
import Cancel from "./views/pages/cancel/Cancel"; 
import  ConfigUsuario from "./views/pages/configUsuario/ConfigUsuario";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videojuegos" element={<Videogames />} />
        <Route path="/accesorios" element={<Accesorios />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/videojuegos/:id/:name" element={<ProductoDetalle />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/configuracionusuario" element={<ConfigUsuario />} />
      </Routes>
    </HashRouter>
  );
}
