import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/reseñas";

export const ListaReseñas = ({ juegoId }) => {
  const [reseñas, setReseñas] = useState([]);

  const fetchReseñas = async () => {
    try {
      const response = await fetch(`${API_URL}/juego/${juegoId}`);
      const data = await response.json();
      setReseñas(data);
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
    }
  };

  useEffect(() => {
    if (juegoId) fetchReseñas();
  }, [juegoId]);

  if (!reseñas.length) return <p>No hay reseñas aún.</p>;

  return (
    <div className="reseñas-lista">
      <h4> Reseñas</h4>
      <ul>
        {reseñas.map((r) => (
          <li key={r._id}>
            ⭐ {r.puntuacion}/5 — {r.dificultad}  
            <br />
            {r.horasJugadas} horas jugadas
            <br />
            {r.recomendacion ? "✅ Recomendado" : "❌ No recomendado"}
            <p>{r.textoReseña}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
