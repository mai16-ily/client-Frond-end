import { useEffect, useState } from "react";
import { useAppContext } from '../context/AppContext';

const API_URL = "http://localhost:5000/api/reseñas";

export const ListaReseñas = ({ juegoId }) => {
  const [reseñas, setReseñas] = useState([]);
  const { refreshTrigger } = useAppContext();

  const fetchReseñas = async () => {
    try {
      if (!juegoId) return setReseñas([]);
      const response = await fetch(`${API_URL}/juego/${juegoId}`);
      const data = await response.json();
      setReseñas(data);
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
    }
  };

  useEffect(() => {
    fetchReseñas();
  }, [juegoId, refreshTrigger]);

  if (!reseñas.length) return <p>No hay reseñas aún.</p>;

  return (
    <div className="reseñas-lista">
      <h4> Reseñas</h4>
      <ul>
        {reseñas.map((r) => (
          <li key={r._id}>
            <strong>⭐ {r.puntuacion}/5</strong> — {r.dificultad}
            <div className="small-meta">{r.horasJugadas} horas • {r.recomendacion ? "✅ Recomendado" : "❌ No recomendado"}</div>
            <p>{r.textoReseña}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
