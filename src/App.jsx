import { useEffect, useState} from "react";
import "/app.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./views/components/Navbar/Navbar";
import Footer from "./views/components/Footer/Footer";
import About from "./views/components/about/About";
import Videogames from "./views/pages/videogames/Videogames";
import Accesorios from "./views/pages/accesorios/Accesorios";
import Register from "./views/pages/login-register/Register";
import Login from "./views/pages/login-register/Login";
import Slider from "./views/components/slider/Slider";


export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/videojuegos" element={<><Navbar /> <Slider/> <Videogames /> <Footer /></>} />
          <Route path="/accesorios" element={<><Navbar /><Accesorios /><Footer /></>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}

