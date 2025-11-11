import { useState, useEffect } from 'react';
import './BibliotecaJuegos.css'; 
import { ListaReseñas } from "./ListaReseñas";
import { FormularioReseña } from "./FormularioReseña";
import './BibliotecaJuegos.css';

const API_URL = 'http://localhost:5000/api/juegos';

export const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
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
    } catch (error) {
      console.error('Error al crear juego:', error);
    }
  };

  // 🟢 Eliminar juego
  const deleteJuego = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setJuegos(juegos.filter((j) => j._id !== id));
    } catch (error) {
      console.error('Error al eliminar juego:', error);
    }
  };

  useEffect(() => {
    fetchJuegos();
  }, []);

  return (
    <div className="container-todolist">
      <div className="title"><h2>🎮 Biblioteca de Juegos</h2></div>

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
        <ul className="list-todolist">
          {juegos.map((juego) => (
            <li key={juego._id} className="item-todolist">
              {juego.imagenPortada && (
                <img src={juego.imagenPortada} alt={juego.titulo} width="50" height="50" />
           )}
              <span className="info-juego">
                <strong>{juego.titulo}</strong> ({juego.añoLanzamiento})<br />
                {juego.genero} — {juego.plataforma}<br />
                Desarrollado por: {juego.desarrollador}<br />
                {juego.descripcion && <em>{juego.descripcion}</em>}
              </span>
              <button onClick={() => deleteJuego(juego._id)} className="btn-del">Eliminar</button>
              <ListaReseñas juegoId={juego._id} />
              <FormularioReseña
                juegoId={juego._id}
                onReseñaCreada={() => fetchJuegos()} // refresca lista al crear reseña
              />

            </li>
        ))}
        </ul>

      </div>
    </div>
  );
};
