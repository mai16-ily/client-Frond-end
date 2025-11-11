import { useState, useEffect } from 'react';
import './BibliotecaJuegos.css'; 
import { ListaReseñas } from "./ListaReseñas";
import { FormularioReseña } from "./FormularioReseña";
import { useAppContext } from '../context/AppContext';

const API_URL = 'http://localhost:5000/api/juegos';

export const BibliotecaJuegos = () => {
  const { triggerRefresh } = useAppContext();
  const [juegos, setJuegos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [nuevoJuego, setNuevoJuego] = useState({
  titulo: '',
  genero: '',
  plataforma: '',
  añoLanzamiento: '',
  desarrollador: '',
  imagenPortada: '',
  descripcion: '',
});


  // 🟢 Cargar juegos desde el backend
  const fetchJuegos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setJuegos(data);
    } catch (error) {
      console.error('Error al cargar juegos:', error);
    }
  };

  // 🟢 Crear nuevo juego
  const addJuego = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoJuego),
      });
      const data = await response.json();
      setJuegos([...juegos, data]);
      setNuevoJuego({ titulo: '', genero: '', plataforma: '', imagenPortada: '', añoLanzamiento: '', desarrollador: '', descripcion: '' });
      triggerRefresh(); // Actualizar stats
    } catch (error) {
      console.error('Error al crear juego:', error);
    }
  };

  // 🟢 Eliminar juego
  const deleteJuego = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setJuegos(juegos.filter((j) => j._id !== id));
      triggerRefresh(); // Actualizar stats
    } catch (error) {
      console.error('Error al eliminar juego:', error);
    }
  };

  // 🟢 Editar juego (iniciar)
  const startEdit = (juego) => {
    setEditingId(juego._id);
    setEditForm({
      titulo: juego.titulo || '',
      genero: juego.genero || '',
      plataforma: juego.plataforma || '',
      añoLanzamiento: juego.añoLanzamiento || '',
      desarrollador: juego.desarrollador || '',
      imagenPortada: juego.imagenPortada || '',
      descripcion: juego.descripcion || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const updated = await res.json();
      setJuegos(juegos.map((j) => (j._id === id ? updated : j)));
      setEditingId(null);
      setEditForm({});
      triggerRefresh(); // Actualizar stats
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  useEffect(() => {
    fetchJuegos();
  }, []);

  return (
    <div className="container-todolist">
      <div className="title"><h2>Biblioteca de Juegos</h2></div>

      <form onSubmit={addJuego}>
  <label>Agregar nuevo juego</label>
  <input
    type="text"
    placeholder="Título"
    value={nuevoJuego.titulo}
    onChange={(e) => setNuevoJuego({ ...nuevoJuego, titulo: e.target.value })}
  />
  <input
    type="text"
    placeholder="Género"
    value={nuevoJuego.genero}
    onChange={(e) => setNuevoJuego({ ...nuevoJuego, genero: e.target.value })}
  />
  <input
    type="text"
    placeholder="Plataforma"
    value={nuevoJuego.plataforma}
    onChange={(e) => setNuevoJuego({ ...nuevoJuego, plataforma: e.target.value })}
  />
  <input
    type="number"
    placeholder="Año de lanzamiento"
    value={nuevoJuego.añoLanzamiento}
    onChange={(e) => setNuevoJuego({ ...nuevoJuego, añoLanzamiento: e.target.value })}
  />
  <input
    type="text"
    placeholder="Desarrollador"
    value={nuevoJuego.desarrollador}
    onChange={(e) => setNuevoJuego({ ...nuevoJuego, desarrollador: e.target.value })}
  />
  <input
    type="text"
    placeholder="URL de imagen (opcional)"
    value={nuevoJuego.imagenPortada}
    onChange={(e) => setNuevoJuego({ ...nuevoJuego, imagenPortada: e.target.value })}
  />
  <textarea
    placeholder="Descripción (opcional)"
    value={nuevoJuego.descripcion}
    onChange={(e) => setNuevoJuego({ ...nuevoJuego, descripcion: e.target.value })}
  />
  <button type="submit">Agregar juego</button>
</form>


      <div className="juegos-list">
        <div className="games-grid">
          {juegos.map((juego) => (
            <article key={juego._id} className="game-card">
              <div className="card-image">
                {juego.imagenPortada ? (
                  <img src={juego.imagenPortada} alt={juego.titulo} />
                ) : (
                  <div className="image-placeholder">No image</div>
                )}
              </div>

              <div className="card-body">
                
                {editingId === juego._id ? (
                  <div className="edit-form">
                    <input value={editForm.titulo} onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })} />
                    <input value={editForm.genero} onChange={(e) => setEditForm({ ...editForm, genero: e.target.value })} />
                    <input value={editForm.plataforma} onChange={(e) => setEditForm({ ...editForm, plataforma: e.target.value })} />
                    <input type="number" value={editForm.añoLanzamiento} onChange={(e) => setEditForm({ ...editForm, añoLanzamiento: e.target.value })} />
                    <input value={editForm.desarrollador} onChange={(e) => setEditForm({ ...editForm, desarrollador: e.target.value })} />
                    <input value={editForm.imagenPortada} onChange={(e) => setEditForm({ ...editForm, imagenPortada: e.target.value })} />
                    <textarea value={editForm.descripcion} onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })} />
                    <div className="card-actions">
                      <button className="btn-save" onClick={() => saveEdit(juego._id)}>Guardar</button>
                      <button className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="game-title">{juego.titulo}</h3>
                    <div className="meta">{juego.genero} • {juego.plataforma} • {juego.añoLanzamiento}</div>
                    <div className="developer">Desarrollador: {juego.desarrollador}</div>
                    {juego.descripcion && <p className="desc">{juego.descripcion}</p>}
                    <div className="card-actions">
                      <button className="btn-edit" onClick={() => startEdit(juego)}>Editar</button>
                      <button className="btn-del" onClick={() => deleteJuego(juego._id)}>Eliminar</button>
                    </div>
                    <ListaReseñas juegoId={juego._id} />
                    <FormularioReseña juegoId={juego._id} onReseñaCreada={() => fetchJuegos()} />
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
