import { useState, useEffect } from 'react';
import './Task.css';

const API_URL = 'http://localhost:5000/api/tasks';

export const Task = () => {
  
  const [tasks, setTasks] = useState([]);

  // 🔹 1. Cargar tareas
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // 🔹 2. Crear tarea
  const addTask = async (e) => {
    e.preventDefault();
    const title = e.target[0].value.trim();
    if (!title) return; // Evitar tareas vacías
    e.target[0].value = '';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error('Error al añadir tarea:', error.message);
    }
  };

  // 🔹 3. Eliminar tarea
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      // Actualiza el estado sin recargar todo
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error.message);
    }
  };

  // 🔹 4. useEffect solo al montar
  useEffect(() => {
    fetchTasks();
  }, []); // 👈 vacío: solo se ejecuta una vez al cargar

  return (
    <div className="container-todolist">
      <div className="title"><h2>Todo List</h2></div>

      <form onSubmit={addTask}>
        <label>Agrega nueva tarea</label>
        <input type="text" placeholder="ej: Realizar informe" />
        <button type="submit">Agregar</button>
      </form>

      <div className="tasks">
        {/* <div className="selected-all">
          <input className="chk-todolist" type="checkbox" />
          <span className="desc-task">Seleccionar todo</span>
        </div> */}

        <ul className="list-todolist">
          {tasks.map((task) => (
            <li key={task._id} className="item-todolist">
              <input className="chk-todolist" type="checkbox" />
              <span className="desc-task">{task.title}</span>
              <button
                onClick={() => deleteTask(task._id)} // ✅ pasamos el id correcto
                className="btn-del"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
