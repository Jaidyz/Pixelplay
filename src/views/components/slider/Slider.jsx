import { useState, useEffect } from 'react';
import './slider.css'

function Slider() {
const images = [
    { id: 1, src: "https://cdn2.steamgriddb.com/hero_thumb/2a23698064df1354a4ba703528ef20e9.jpg", alt: "Hollow Knight" },
    { id: 2, src: "https://cdn2.steamgriddb.com/hero_thumb/5b359e020d0c4726dd6876f6e6500648.jpg", alt: "Elnden Ring" },
    { id: 3, src: "https://cdn2.steamgriddb.com/hero_thumb/55d7bfc270b101f7ce074ae6396e54f5.jpg", alt: "Minecraft" },
    { id: 4, src: "https://cdn2.steamgriddb.com/hero_thumb/d7da8f9d99e5ed3ac7ab00568ae36915.jpg", alt: "Assassin’s Creed Valhalla" },
    { id: 5, src: "https://cdn2.steamgriddb.com/hero_thumb/09a824a09b7734ea1cfd2f9a34dedbfd.jpg", alt: "Cyberpunk 2077" }
  ];

  // Estado para controlar la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efecto para cambiar la imagen automáticamente cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [images.length]);

  // Función para cambiar manualmente a la imagen anterior
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Función para cambiar manualmente a la siguiente imagen
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Función para ir directamente a una imagen específica
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
<div className="slider-container">
      
      {/* Contenedor del slider */}
      <div className="slider-wrapper">
        {/* Imagen actual */}
        <div className="slides">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`slide ${index === currentImageIndex ? "active" : ""}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="slide-image"
              />
            </div>
          ))}
        </div>
        
        {/* Botones de navegación */}
        <button
          onClick={prevImage}
          className="nav-button prev-button"
        >
          ←
        </button>
        <button
          onClick={nextImage}
          className="nav-button next-button"
        >
          →
        </button>
      </div>
      
      {/* Indicadores de posición */}
      <div className="indicators">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`indicator ${index === currentImageIndex ? "active" : ""}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default Slider