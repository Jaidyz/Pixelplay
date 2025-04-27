import React from 'react'
import './Card.css'
import ShoppingCart from "../../../assets/icons/ShoppingCart"
import HeartIcon from "../../../assets/icons/HeartIcon"

function Card({name, price,imgLink}) {
  return (
        <section className="card">
            <section className='img-container'>
            <img src={imgLink} alt={name} />
            </section>
            <h3>{name}</h3>
            <h2>{price}</h2>
            <section className='actions'>
            <button>Ver más</button>
            <button><ShoppingCart/></button>
            <button><HeartIcon/> </button>
            </section>
        </section>
  )
}

export default Card