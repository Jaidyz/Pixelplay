import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
function Login() {
  return (
    <>
      <div className="logo">
        <Link to="/">
          <img src="./src/assets/LogoPixelPlay.webp" alt="" />
        </Link>
      </div>
      <div className="container-login-register">
        <div className="plantilla login">
          <div className="cambio">
            <h2>¿No estas registrado?</h2>
            <p>¡Únete a nuestra comunidad hoy mismo!</p>
            <Link to="/register">
              <button id="registro">Registrate</button>
            </Link>
          </div>
          <div className="formulario">
            <h2>
              Iniciar sesión en <strong>Pixelplay</strong>
            </h2>
            <form action="" method="post">
              <label>
                <box-icon name="envelope" color="#757575" />
                <input
                  type="email"
                  placeholder="Correo electronico"
                  required=""
                  name="correo"
                />
              </label>
              <label>
                <box-icon name="lock-alt" color="#757575" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  required=""
                  name="contraseña"
                />
              </label>
              <input
                type="submit"
                defaultValue="Ingresar"
                name="iniciarsesion"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
