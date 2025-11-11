import { useEffect, useState } from 'react';
import './Sidebar.css';
import { useAppContext } from '../context/AppContext';

const API_URL = 'http://localhost:5000/api/juegos';

export const Sidebar = ({ toggleTheme }) => {
  const { refreshTrigger } = useAppContext();
  const [stats, setStats] = useState({
    total: 0,
    completados: 0,
    porcentajeCompletados: 0,
    horasTotales: 0,
    promedioPuntuacion: 0,
  });

  const [progreso, setProgreso] = useState({
    notPlayed: 0,
    toPlay: 0,
    playing: 0,
    paused: 0,
    finished: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(API_URL);
      const data = res.ok ? await res.json() : [];

      if (data.length === 0) {
        setStats({
          total: 0,
          completados: 0,
          porcentajeCompletados: 0,
          horasTotales: 0,
          promedioPuntuacion: 0,
        });
        setProgreso({
          notPlayed: 0,
          toPlay: 0,
          playing: 0,
          paused: 0,
          finished: 0,
        });
        return;
      }

      const total = data.length;
      const completados = data.filter((j) => j.completado).length;
      const horasTotales = data.reduce((acc, j) => acc + (j.horasJugadas || 0), 0);
      const puntuaciones = data.filter((j) => j.puntuacion).map((j) => j.puntuacion);
      const promedioPuntuacion =
        puntuaciones.length > 0
          ? (puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length).toFixed(1)
          : 0;

      const notPlayedCount = Math.floor(total * 0.1);
      const toPlayCount = total - completados - notPlayedCount;
      const playingCount = Math.floor(total * 0.2);

      setStats({
        total,
        completados,
        porcentajeCompletados: ((completados / total) * 100).toFixed(0),
        horasTotales,
        promedioPuntuacion,
      });

      setProgreso({
        notPlayed: notPlayedCount,
        toPlay: toPlayCount > 0 ? toPlayCount : 0,
        playing: playingCount,
        paused: 0,
        finished: completados,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const getDarkModeStatus = () => {
    return document.body.classList.contains('light-mode');
  };

  return (
    <aside className="sidebar">
      {/* Header con logo/título */}
      <div className="sidebar-header">
        <h1 className="sidebar-title"> Game Tracker <img className='logo-image' src="/src/assets/pictures/logo.png" alt="" /></h1>
      </div>

      {/* Stats rápidas */}
      <div className="sidebar-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.porcentajeCompletados}%</div>
          <div className="stat-label">Completados</div>
        </div>
      </div>

      {/* Spaces / Horas */}
      <div className="spaces-card">
        <div className="spaces-item">
          <div className="spaces-label">Spaces</div>
          <div className="spaces-number">{stats.horasTotales}</div>
        </div>
      </div>

      {/* Statistics section */}
      <div className="statistics-section">
        <h3 className="section-title">Statistics</h3>
        <div className="stat-box">
          <span className="stat-icon">⭐</span>
          <div>
            <div className="stat-value">{stats.promedioPuntuacion}</div>
            <div className="stat-text">Puntuación promedio</div>
          </div>
        </div>
      </div>

      {/* Botón de tema (subido) */}
      <div className="sidebar-theme">
        <button className="btn-theme-toggle" onClick={toggleTheme} title="Cambiar tema">
          {getDarkModeStatus() ? '☀️ Modo claro' : '🌙 Modo oscuro'}
        </button>
      </div>

      {/* Progress / Release states */}
      <div className="progress-section">
        <h3 className="section-title">Progress</h3>
        <div className="progress-item">
          <input type="radio" id="notPlayed" name="progress" defaultChecked />
          <label htmlFor="notPlayed">
            <span className="progress-label">Not played</span>
            <span className="progress-count">{progreso.notPlayed}</span>
          </label>
        </div>
        <div className="progress-item">
          <input type="radio" id="toPlay" name="progress" />
          <label htmlFor="toPlay">
            <span className="progress-label">To play</span>
            <span className="progress-count">{progreso.toPlay}</span>
          </label>
        </div>
        <div className="progress-item">
          <input type="radio" id="playing" name="progress" />
          <label htmlFor="playing">
            <span className="progress-label">Playing</span>
            <span className="progress-count">{progreso.playing}</span>
          </label>
        </div>
        <div className="progress-item">
          <input type="radio" id="paused" name="progress" />
          <label htmlFor="paused">
            <span className="progress-label">Paused</span>
            <span className="progress-count">{progreso.paused}</span>
          </label>
        </div>
        <div className="progress-item">
          <input type="radio" id="finished" name="progress" />
          <label htmlFor="finished">
            <span className="progress-label">Finished</span>
            <span className="progress-count">{progreso.finished}</span>
          </label>
        </div>
      </div>

    </aside>
  );
};
