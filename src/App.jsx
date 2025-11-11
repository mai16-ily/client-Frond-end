import { BibliotecaJuegos } from './components/BibliotecaJuegos';
import { Sidebar } from './components/Sidebar';
import './index.css';
import { EstadisticasPersonales } from './components/EstadisticasPersonales';

function App() {
    const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('light-mode');
  };

    return (
        <div className="app-container">
            <Sidebar toggleTheme={toggleTheme} />
            <main className="main-content">
                <header className="app-header">
                    <div className="logo-placeholder">
                      {/* Si colocas tu imagen en public/logo.png se mostrará aquí automáticamente. */}
                      <img className="app-logo" src="/logo.png" alt="App logo (coloca public/logo.png)" />
                    </div>
                    <div className="app-title">Game Tracker</div>
                </header>
                <BibliotecaJuegos />
                <EstadisticasPersonales />
            </main>
        </div>
    );
} 

export default App; 


