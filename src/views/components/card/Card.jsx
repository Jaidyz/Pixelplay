import React from 'react';
import './Card.css';
import ShoppingCart from '../../../assets/icons/ShoppingCart';
import HeartIcon from '../../../assets/icons/HeartIcon';
import { Link } from 'react-router-dom';

function Card({ id, name, price, imgLink, onAddToCart, onAddToFavorites }) {
  return (
    <section className="card">
      <section className="img-container">
        <img src={imgLink} alt={name} />
      </section>
      <h3>{name}</h3>
      <h2>{price}</h2>
      <section className="actions">
        <button>
          <Link to={`/videojuegos/${id}/${name}`}>Ver más</Link>
        </button>
        <button onClick={() => onAddToCart(id)}>
          <ShoppingCart/>
        </button>
        <button onClick={() => onAddToFavorites(id)}>
          <HeartIcon/> 
        </button>
      </section>
    </section>
  );
}

export default Card;
