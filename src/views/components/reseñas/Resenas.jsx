import { useState, useEffect } from "react";
import { supabase } from "../../../../supabase/supabase.config.jsx";
import { useParams } from "react-router-dom";
import "./resenas.css";
import { CircleUserRound, Star } from "lucide-react";

function Resenas() {
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchReseñas = async () => {
        try {
          const { data, error } = await supabase
            .from("reseñas")
            .select("id, comentario, calificacion,fecha, usuarios(nombre)")
            .eq("producto_id", id);

          if (error) throw error;

          setReseñas(data);
        } catch (error) {
          console.error("Error fetching reseñas:", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchReseñas();
    }
  }, [id]);

  if (loading)
    return (
      <div className="reseña">
        <p className="cargando-reseñas">Cargando reseñas...</p>
      </div>
    );
  if (!reseñas.length)
    return (
      <div className="reseña">
        <p className="no-reseñas">No hay reseñas disponibles.</p>
      </div>
    );

  return (
    <div className="reseñas">
      <h2>Reseñas</h2>
      {reseñas.map((reseña) => (
        <div key={reseña.id} className="reseña">
          <div className="usuario-reseña">
            <CircleUserRound
              className="icono-usuario"
              color="var(--main-color)"
              size={60}
            />
            <p>{reseña.usuarios?.nombre || "Anónimo"}</p>
          </div>
          <p>{reseña.comentario}</p>
          <div className="fecha-calificacion">
            <p>
              {" "}
              {[...Array(5)].map((_, i) =>
                i < reseña.calificacion ? (
                  <Star
                    fill="var(--main-color) !important"
                    stroke="var(--main-color)"
                  />
                ) : (
                  <Star stroke="var(--main-color)" />
                )
              )}
            </p>
            <p className="fecha">
              {" "}
              {new Date(reseña.fecha).toLocaleString("es-CO", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Resenas;
