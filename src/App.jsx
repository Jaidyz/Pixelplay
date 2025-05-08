import { useEffect, useState} from "react";
import "/app.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Videogames from "./views/pages/videogames/Videogames";
import Accesorios from "./views/pages/accesorios/Accesorios";
import Register from "./views/pages/login-register/Register";
import Login from "./views/pages/login-register/Login";
import Home from "./views/pages/home";


export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/videojuegos" element={<Videogames />} />
          <Route path="/accesorios" element={<Accesorios />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}

