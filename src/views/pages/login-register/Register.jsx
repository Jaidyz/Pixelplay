import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function Register() {
  return (
    <>
      <div className="logo">
        <Link to="/">
          <img src="./src/assets/LogoPixelPlay.webp" alt="" />
        </Link>
      </div>
      <div className="container-login-register">
        <div className="plantilla register">
          <div className="cambio">
            <h2>¿Ya estas registrado?</h2>
            <p>¡Inicias sesión y disfruta nuestros servicios!</p>
            <Link to="/login">
              <button id="logueo">Iniciar sesion</button>
            </Link>
          </div>
          <div className="formulario">
            <h2>
              Unete a nosotros, <strong>Pixelplay</strong>
            </h2>
            <form action="" method="post">
              <label>
                <box-icon name="user" color="#757575" />
                <input
                  type="text"
                  placeholder="Nombres"
                  required=""
                  name="nombrer"
                />
              </label>
              <label>
                <box-icon name="user" color="#757575" />
                <input
                  type="text"
                  placeholder="Apellidos"
                  required=""
                  name="apellidor"
                />
              </label>
              <label>
                <box-icon name="envelope" color="#757575" />
                <input
                  type="email"
                  placeholder="Correo electronico"
                  required=""
                  name="correor"
                />
              </label>
              <label>
                <box-icon name="lock-alt" color="#757575" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  required=""
                  name="contraseñar"
                />
              </label>
              <input type="submit" defaultValue="Registrase" name="registrar" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
