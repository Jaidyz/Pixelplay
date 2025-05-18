import { useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../../supabase/supabase.config.jsx";


import { Link } from "react-router-dom";
import "./styles.css";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [verContrasena, setVerContrasena] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setRegisterError(null);

      // Extraer datos del formulario
      const { nombre, apellido, correo, contraseña } = data;

      // Llamar a la función signUp del contexto de autenticación
      const result = await signUp(correo, contraseña, `${nombre} ${apellido}`);

      if (result.error) {
        setRegisterError(result.error.message);
        return;
      }

      // Luego crear el registro en la tabla de usuarios
      const userId = result.data.user.id;
      const userResponse = await supabase.from("usuarios").insert([
        {
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          auth_user_id: userId,
          direccion: null,
          telefono: null,
          tipo: "usuario",
        },
      ]);

      if (userResponse.error) {
        setRegisterError("Error al crear el perfil de usuario");
        console.error(userResponse.error);
        return;
      }

      if (result && result.error) {
        console.error("Error de registro:", result.error);

        // Verificamos el tipo de error (puede variar según la estructura)
        const errorMessage = result.error.message || result.error.toString();

        // Comprobamos si el email ya está registrado
        if (
          errorMessage.toLowerCase().includes("email already") ||
          errorMessage.toLowerCase().includes("already in use") ||
          errorMessage.toLowerCase().includes("ya existe") ||
          errorMessage.toLowerCase().includes("ya registrado")
        ) {
          setRegisterError(
            "Este correo electrónico ya está registrado. Intenta iniciar sesión."
          );
        } else {
          setRegisterError(
            "Error al registrarse. Por favor, inténtalo de nuevo más tarde."
          );
        }
        return; // Importante: detenemos la ejecución aquí si hay error
      }

      // Mostrar mensaje de éxito y redirigir al login
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title:
          "Registro exitoso. Te hemos enviado un correo de confirmación. Por favor, verifica tu correo para activar tu cuenta.",
        showConfirmButton: false,
        timer: 1500,
        theme: "dark",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error inesperado:", error);
      setRegisterError(
        "Ocurrió un error inesperado. Inténtalo de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <User color="#757575" />
                <input
                  type="text"
                  placeholder="Nombres"
                  name="nombrer"
                  {...register("nombre", {
                    required: {
                      value: true,
                      message: "Este campo es obligatorio",
                    },
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message: "El nombre no puede tener más de 20 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "El nombre solo puede contener letras",
                    },
                  })}
                />
              </label>
              {errors.nombrer && (
                <span className="error">{errors.nombrer.message}</span>
              )}
              <label>
                <User color="#757575" />
                <input
                  type="text"
                  placeholder="Apellidos"
                  name="apellido"
                  {...register("apellido", {
                    required: {
                      value: true,
                      message: "Este campo es obligatorio",
                    },
                    minLength: {
                      value: 3,
                      message: "El apellido debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 20,
                      message:
                        "El apellido no puede tener más de 20 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "El apellido solo puede contener letras",
                    },
                  })}
                />
              </label>
              {errors.apellido && (
                <span className="error">{errors.apellido.message}</span>
              )}
              <label>
                <Mail color="#757575" />
                <input
                  type="email"
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
                  name="contraseña"
                  {...register("contraseña", {
                    required: {
                      value: true,
                      message: "Este campo es obligatorio",
                    },
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener al menos 8 caracteres",
                    },
                    validate: (value) => {
                      if (!/[A-Z]/.test(value)) {
                        return "Debe contener al menos una letra mayúscula";
                      }
                      if (!/[a-z]/.test(value)) {
                        return "Debe contener al menos una letra minúscula";
                      }
                      if (!/\d/.test(value)) {
                        return "Debe contener al menos un número";
                      }
                      if (/[^a-zA-Z0-9]/.test(value)) {
                        return "No se permiten caracteres especiales";
                      }
                      if (value.length < 8) {
                        return "Debe tener al menos 8 caracteres";
                      }
                      return true;
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
              <input type="submit" defaultValue="Registrase" name="registrar" />
            </form>
            {registerError && (
              <div className="error-container">
                <span className="error">{registerError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
