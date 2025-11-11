import { useState } from "react";

const API_URL = "http://localhost:5000/api/reseñas";

export const FormularioReseña = ({ juegoId, onReseñaCreada }) => {
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
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, juegoId }),
      });

      if (!response.ok) throw new Error("Error al enviar la reseña");

      const data = await response.json();
      onReseñaCreada(data);
      setFormData({
        puntuacion: 5,
        horasJugadas: 0,
        dificultad: "Media",
        recomendacion: true,
        textoReseña: "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reseña-form">
      <h4> Añadir reseña</h4>
      <label>Puntuación (1–5)</label>
      <input
        type="number"
        name="puntuacion"
        min="1"
        max="5"
        value={formData.puntuacion}
        onChange={handleChange}
      />

      <label>Horas jugadas</label>
      <input
        type="number"
        name="horasJugadas"
        value={formData.horasJugadas}
        onChange={handleChange}
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

      <textarea
        name="textoReseña"
        placeholder="Escribe tu reseña..."
        value={formData.textoReseña}
        onChange={handleChange}
      ></textarea>

      <button type="submit">Guardar reseña</button>
    </form>
  );
};
