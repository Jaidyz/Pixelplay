import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 'animate.css';
import './About.css';

export default function About() {
  const threeContainer = useRef(null);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
  
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl && gl instanceof WebGLRenderingContext;
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL() || !threeContainer.current) {
      setWebGLAvailable(false);
      return;
    }


    let scene, camera, renderer, controls, animationId;
    const gameObjects = [];

   
    const initThreeJS = () => {
      try {
    
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
          75,
          threeContainer.current.clientWidth / threeContainer.current.clientHeight,
          0.1,
          1000
        );
        camera.position.z = 15;

      
        renderer = new WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(threeContainer.current.clientWidth, threeContainer.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        threeContainer.current.appendChild(renderer.domElement);

     
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff00ff, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

       
        const createGameElements = () => {
          const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.7, 16, 16),
            new THREE.ConeGeometry(0.5, 1, 16),
            new THREE.TorusGeometry(0.6, 0.2, 16, 32)
          ];

          const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

          for (let i = 0; i < 20; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhongMaterial({
              color: colors[Math.floor(Math.random() * colors.length)],
              emissive: 0x111111,
              specular: 0xffffff,
              shininess: 30,
              transparent: true,
              opacity: 0.85
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10
            );
            mesh.rotation.set(
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            );
            mesh.userData = {
              speed: Math.random() * 0.01 + 0.005,
              rotationSpeed: Math.random() * 0.02 + 0.01
            };
            scene.add(mesh);
            gameObjects.push(mesh);
          }
        };

        createGameElements();

        
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;

        const animate = () => {
          animationId = requestAnimationFrame(animate);
          
          gameObjects.forEach(obj => {
            obj.rotation.x += obj.userData.rotationSpeed;
            obj.rotation.y += obj.userData.rotationSpeed * 0.7;
            obj.position.y = Math.sin(Date.now() * obj.userData.speed) * 3;
          });
          
          controls.update();
          renderer.render(scene, camera);
        };
        
        animate();

      
        const handleResize = () => {
          if (!threeContainer.current) return;
          camera.aspect = threeContainer.current.clientWidth / threeContainer.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(threeContainer.current.clientWidth, threeContainer.current.clientHeight);
        };
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);

      } catch (error) {
        console.error('Error en Three.js:', error);
        setWebGLAvailable(false);
      }
    };

    initThreeJS();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer && threeContainer.current) {
        threeContainer.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      if (controls) controls.dispose();
      if (scene) {
        scene.traverse(child => {
          if (child.isMesh) {
            child.geometry?.dispose();
            child.material?.dispose();
          }
        });
      }
    };
  }, []);

  return (
    <section className="about-container">
      {/* Video de fondo */}
      <video autoPlay loop muted className="background-video">
        <source src="src/assets/video_fondo.mp4" type="video/mp4" />
        Tu navegador no soporta el video HTML5.
      </video>

      {/* Contenedor Three.js */}
      <div className="threejs-container" ref={threeContainer} />
      
      {/* Mensaje si WebGL no está disponible */}
      {!webGLAvailable && (
        <div className="webgl-warning">
          <p>⚠️ Los efectos 3D no están disponibles en tu navegador. Para la mejor experiencia, usa Chrome o Firefox.</p>
        </div>
      )}

      {/* Contenido principal - Información de la tienda */}
      <div className="content">
        <div className="img1 animate__animated animate__fadeInRight">
          <img src="src/assets/img1.png" alt="Juegos destacados" />
        </div>
        
        <div className="img2 animate__animated animate__fadeInLeft">
          <img src="src/assets/img2.png" alt="Consolas y accesorios" />
        </div>
        
        <div className="pixel-play-letras animate__animated animate__zoomIn">
          <img src="src/assets/pixelPlayLetras.webp" alt="PixelPlay" />
        </div>
        
        <div className="pixel-play-logo animate__animated animate__zoomIn">
          <img src="/LogoPixelPlay.png" alt="Logo PixelPlay" />
        </div>

        {/* Sección Quiénes Somos */}
        <div className="quienesSomos animate__animated animate__fadeInUp">
          <h2>Quiénes Somos</h2>
          <p>
            En <strong>PixelPlay</strong> somos apasionados del mundo gaming. Desde 2010, nos dedicamos a 
            ofrecer los mejores videojuegos, consolas y accesorios del mercado. Nuestro equipo está 
            formado por gamers expertos que te asesorarán para que encuentres exactamente lo que buscas.
          </p>
          <p>
            Más que una tienda, somos una comunidad donde los amantes de los videojuegos encuentran su hogar.
          </p>
        </div>

        {/* Sección Misión */}
        <div className="mision animate__animated animate__fadeInUp">
          <h2>Misión</h2>
          <p>
            Nuestra misión es <strong>revolucionar la experiencia de compra gaming</strong>, ofreciendo:
          </p>
          <ul>
            <li>Catálogo actualizado con los últimos lanzamientos</li>
            <li>Precios competitivos y ofertas exclusivas</li>
            <li>Asesoramiento personalizado por expertos</li>
            <li>Envíos rápidos y seguros a todo el país</li>
            <li>Soporte post-venta excepcional</li>
          </ul>
          <p>
            Queremos que cada cliente viva la emoción del gaming como si estuviera en la sala de su casa.
          </p>
        </div>

        {/* Sección Visión */}
        <div className="vision animate__animated animate__fadeInUp">
          <h2>Visión</h2>
          <p>
            Para 2025, <strong>PixelPlay</strong> será reconocida como:
          </p>
          <ul>
            <li>Líder en distribución de videojuegos a nivel nacional</li>
            <li>Pionera en experiencias de realidad virtual gaming</li>
            <li>Referente en eventos y torneos de eSports</li>
            <li>Comunidad gaming más grande del país</li>
          </ul>
          <p>
            Innovamos constantemente para ofrecerte el futuro del entretenimiento digital hoy.
          </p>
        </div>
      </div>
    </section>
  );
}