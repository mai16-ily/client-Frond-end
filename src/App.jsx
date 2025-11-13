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
                      <img className="app-logo" src="/title-logo.png" alt="Titulo" />
                    </div>

                </header>
                <BibliotecaJuegos />
                <EstadisticasPersonales />
            </main>
        </div>
    );
} 

export default App; 


