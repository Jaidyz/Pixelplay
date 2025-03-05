import { useEffect, useState } from "react";
import './App.css'
import Headerlogged from "./views/components/headerLogged/Headerlogged";
import Footer from "./views/components/Footer/Footer";
import About from "./views/components/about/About";


export default function App() {
  return (
    <>
    <Headerlogged/>
    <About/>
    <Footer/>
    </>
  )
}
