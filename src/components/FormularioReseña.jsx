import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const API_URL = "http://localhost:5000/api/resenas";

export const FormularioReseña = ({ juegoId, onReseñaCreada }) => {
  const { triggerRefresh } = useAppContext();
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    puntuacion: 5,
    horasJugadas: 0,
    dificultad: "Media",
    recomendacion: true,
    textoReseña: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const reseñaParaEnviar = {
        ...formData,
        horasJugadas: parseInt(formData.horasJugadas, 10),
        puntuacion: parseInt(formData.puntuacion, 10),
        juegoId,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reseñaParaEnviar),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al enviar la reseña");
      }

      const data = await response.json();
      console.log("Reseña guardada:", data);
      
      setSuccess("¡Reseña guardada exitosamente!");
      setTimeout(() => setSuccess(''), 3000);
      
      // Limpiar formulario
      setFormData({
        puntuacion: 5,
        horasJugadas: 0,
        dificultad: "Media",
        recomendacion: true,
        textoReseña: "",
      });

      // Callback si existe
      if (onReseñaCreada) onReseñaCreada();
      
      // Disparar refresh global para actualizar stats y lista de reseñas
      triggerRefresh();
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error al guardar la reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reseña-form">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <h4>Añadir reseña</h4>

      <label>Puntuación</label>
      <div className="star-rating" role="radiogroup" aria-label="Puntuación">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${
              hoverRating > 0
                ? hoverRating >= n
                  ? "filled"
                  : ""
                : formData.puntuacion >= n
                ? "filled"
                : ""
            }`}
            onClick={() => setFormData({ ...formData, puntuacion: n })}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-pressed={formData.puntuacion >= n}
            aria-label={`${n} estrellas`}
            title={`${n} estrellas`}
          >
            ★
          </button>
        ))}
      </div>

      <label>Horas jugadas</label>
      <input
        type="number"
        name="horasJugadas"
        value={formData.horasJugadas}
        onChange={handleChange}
        min="0"
      />

      <label>Dificultad</label>
      <select
        name="dificultad"
        value={formData.dificultad}
        onChange={handleChange}
      >
        <option>Fácil</option>
        <option>Media</option>
        <option>Difícil</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="recomendacion"
          checked={formData.recomendacion}
          onChange={handleChange}
        />
        ¿Recomiendas este juego?
      </label>

      <label>Escribe tu reseña...</label>
      <textarea
        name="textoReseña"
        placeholder="Comparte tu experiencia con este juego..."
        value={formData.textoReseña}
        onChange={handleChange}
        rows="3"
      ></textarea>

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar reseña"}
      </button>
    </form>
  );
};
