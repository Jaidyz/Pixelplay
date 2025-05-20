import React from 'react'
import About from "./../components/about/About"
import Footer from "./../components/Footer/Footer"
import Navbar from "./../components/navbar/Navbar"

function home() {
  return (
    <>
    <Navbar/>
    <About/>
    <Footer/>
    </>
  )
}

export default home