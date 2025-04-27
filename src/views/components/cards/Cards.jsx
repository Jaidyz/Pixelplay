import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../card/Card';
import './cards.css';

function Cards({tipo}) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className='cards'>
        <section className='card-container'>
            {productos
              .filter(producto => producto.tipo === tipo)
              .map(producto => (
                <Card
                    key={producto.producto_id} 
                    name={producto.nombre} 
                    price={producto.precio} 
                    imgLink={producto.imagen_url}/>
              ))}        
        </section>
    </section>
  )
}

export default Cards