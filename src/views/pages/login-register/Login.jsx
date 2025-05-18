import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
function Login() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [verContrasena, setVerContrasena] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setLoginError(null);

      // Extraer email y contraseña de los datos del formulario
      const { correo, contraseña } = data;

      // Llamar a la función signIn del contexto de autenticación
      const { error } = await signIn(correo, contraseña);

      if (error) {
        // Si hay un error, mostrar el mensaje
        console.error("Error de inicio de sesión:", error.message);
        setLoginError(
          error.message === "Invalid login credentials"
            ? "Credenciales inválidas. Verifica tu correo y contraseña."
            : "Error al iniciar sesión. Inténtalo de nuevo más tarde."
        );
      } else {
        // Si el inicio de sesión es exitoso, redirigir al usuario
        console.log("Inicio de sesión exitoso");
        navigate("/"); // Redirige a la página principal después del login
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setLoginError(
        "Ocurrió un error inesperado. Inténtalo de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

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
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <Mail color="#757575" />
                <input
                  type="text"
                  placeholder="Correo electronico"
                  name="correo"
                  {...register("correo", {
                    required: {
                      value: true,
                      message: "Este campo es obligatorio",
                    },
                    pattern: {
                      value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: "El correo no es valido",
                    },
                  })}
                />
              </label>
              {errors.correo && (
                <span className="error">{errors.correo.message}</span>
              )}
              <label>
                <Lock color="#757575" />
                <input
                  type={verContrasena ? "password" : "text"}
                  placeholder="Contraseña"
                  required=""
                  name="contraseña"
                  {...register("contraseña", {
                    required: {
                      value: true,
                      message: "Este campo es obligatorio",
                    },
                  })}
                />
                <span
                  className="eye"
                  onClick={() => {
                    setVerContrasena(!verContrasena);
                  }}
                >
                  {verContrasena ? (
                    <Eye color="#757575" />
                  ) : (
                    <EyeOff color="#757575" />
                  )}
                </span>
              </label>
              {errors.contraseña && (
                <span className="error">{errors.contraseña.message}</span>
              )}
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
