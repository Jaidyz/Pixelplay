import React from "react";
import "/app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/pages/Home";
import Videogames from "./views/pages/videogames/Videogames";
import Accesorios from "./views/pages/accesorios/Accesorios";
import Register from "./views/pages/login-register/Register";
import Login from "./views/pages/login-register/Login";
import ProductoDetalle from "./views/pages/producto-detalle/ProductoDetalle";
import AdminPanel from "./views/pages/admin-panel/AdminPanel";
import Success from "./views/pages/Success/Success";  
import Cancel from "./views/pages/Cancel/Cancel";    
import Navbar from "./views/components/Navbar/Navbar";     
export default function App() {
  return (
    <BrowserRouter>
      {/* Incluye el Navbar globalmente si lo deseas */}
      <Navbar />
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
      </Routes>
    </BrowserRouter>
  );
}
