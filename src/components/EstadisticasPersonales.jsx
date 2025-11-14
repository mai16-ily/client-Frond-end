import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAppContext } from "../context/AppContext";  
import "./EstadisticasPersonales.css";

const API_URL = "http://localhost:5000/api/juegos";

export const EstadisticasPersonales = () => {
  const [juegos, setJuegos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    promedioPuntuacion: 0,
    completados: 0,
    horasTotales: 0,
  });

  const { refreshTrigger } = useAppContext();  // ← ESCUCHAMOS CAMBIOS

  const fetchJuegos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setJuegos(data);
    } catch (error) {
      console.error("Error al cargar juegos:", error);
    }
  };

  const calcularEstadisticas = (data) => {
    const total = data.length;
    const completados = data.filter((j) => j.completado).length;
    const horasTotales = data.reduce((acc, j) => acc + (j.horasJugadas || 0), 0);

    const puntuaciones = data
      .filter((j) => j.puntuacion !== undefined && j.puntuacion !== null)
      .map((j) => j.puntuacion);

    const promedioPuntuacion = puntuaciones.length
      ? (puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length).toFixed(1)
      : 0;

    setEstadisticas({
      total,
      completados: total > 0 ? ((completados / total) * 100).toFixed(1) : 0,
      horasTotales,
      promedioPuntuacion,
    });
  };

  useEffect(() => {
    fetchJuegos();
  }, [refreshTrigger]);  

  useEffect(() => {
    if (juegos.length) calcularEstadisticas(juegos);
  }, [juegos]);

  return (
    <div className="estadisticas-container">
      <h2>Estadísticas Personales</h2>
      <div className="estadisticas-cards">
        <div className="card">
          <h3>{estadisticas.total}</h3>
          <p>Juegos en total</p>
        </div>
        <div className="card">
          <h3>{estadisticas.promedioPuntuacion}</h3>
          <p>Puntuación promedio</p>
        </div>
        <div className="card">
          <h3>{estadisticas.completados}%</h3>
          <p>Completados</p>
        </div>
        <div className="card">
          <h3>{estadisticas.horasTotales}</h3>
          <p>Horas jugadas</p>
        </div>
      </div>

      <div className="grafico">
        <h3>Horas jugadas por juego</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={juegos} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="titulo" tick={{ fill: "#ccc", fontSize: 12 }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Bar dataKey="horasJugadas" fill="url(#colorHoras)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b2ff7" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#f107a3" stopOpacity={0.5}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
