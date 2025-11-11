import { BibliotecaJuegos } from './components/BibliotecaJuegos';
import './index.css';
import { EstadisticasPersonales } from './components/EstadisticasPersonales';

function App() {
    const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('light-mode');
  };

    return (
        <div className="app-container">
            <button className="btn-toggle-theme" onClick={toggleTheme}>
            Cambiar tema
            </button>
            <BibliotecaJuegos />
            <EstadisticasPersonales />
        </div>
    );
} 

export default App; 


