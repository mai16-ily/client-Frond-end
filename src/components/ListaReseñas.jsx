import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const API_URL = "http://localhost:5000/api/resenas";

export const ListaReseñas = ({ juegoId }) => {
  const [reseñas, setReseñas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { refreshTrigger, triggerRefresh } = useAppContext();

  const fetchReseñas = async () => {
    try {
      if (!juegoId) return setReseñas([]);
      const response = await fetch(`${API_URL}/juego/${juegoId}`);
      const data = await response.json();
      setReseñas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
    }
  };

  useEffect(() => {
    fetchReseñas();
  }, [juegoId, refreshTrigger]);

  if (!reseñas || reseñas.length === 0) return null;

  const deleteReseña = async (id) => {
    if (!confirm("¿Eliminar la reseña?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    triggerRefresh();
  };

  const saveEdit = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (!res.ok) return alert("Error al actualizar");
    setEditId(null);
    setEditForm({});
    triggerRefresh();
  };

  return (
    <div className="reseñas-lista">
      <h4>Reseñas</h4>
      <ul>
        {reseñas.map((r) => (
          <li key={r._id}>
            {editId === r._id ? (
              <>
                <label>Puntuación</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editForm.puntuacion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, puntuacion: e.target.value })
                  }
                />

                <label>Horas Jugadas</label>
                <input
                  type="number"
                  value={editForm.horasJugadas}
                  onChange={(e) =>
                    setEditForm({ ...editForm, horasJugadas: e.target.value })
                  }
                />

                <textarea
                  value={editForm.textoReseña}
                  onChange={(e) =>
                    setEditForm({ ...editForm, textoReseña: e.target.value })
                  }
                ></textarea>

                <button onClick={() => saveEdit(r._id)}>Guardar</button>
                <button onClick={() => setEditId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <strong>⭐ {r.puntuacion}/5</strong> — {r.dificultad}
                <div className="small-meta">
                  {r.horasJugadas} horas •{" "}
                  {r.recomendacion ? "✅ Recomendado" : "❌ No recomendado"}
                </div>
                <p>{r.textoReseña}</p>

                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditId(r._id);
                    setEditForm(r);
                  }}
                >
                  Editar
                </button>

                <button
                  className="btn-del"
                  onClick={() => deleteReseña(r._id)}
                >
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
