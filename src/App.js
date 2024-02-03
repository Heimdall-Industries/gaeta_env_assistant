import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Mineria from './Mineria';
import Transporte from './Transporte';
import Scan from './Scan';
const App = () => {
  const [activeSection, setActiveSection] = useState('flotas');

  const toggleSection = (section) => {
    setActiveSection(section);
  };
  

  return (
   
    
    <div className="container mt-4">
      <h1>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
          <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
        </svg>
        &nbsp; Gaeta env Assistant &nbsp;
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
          <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
        </svg>
      </h1>
      <div className="mb-4">
        <button
          className={`btn ${activeSection === 'flotas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => toggleSection('flotas')}
          >
          SCAN env 🛰️
        </button>
        <button
          className={`btn ${activeSection === 'mineria' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => toggleSection('mineria')}
          >
          TRANSPORT env 🚀
        </button>
        <button
          className={`btn ${activeSection === 'otra' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => toggleSection('otra')}
          >
          MINING env 💎
        </button>
      </div>

      {activeSection === 'flotas' && (
        <div>
          <Scan
            title="Sección 1"
            content={<p>Contenido de la sección 1...</p>}
          />
        </div>
        )}

      {activeSection === 'mineria' && (
        <div>
          <Transporte
            title="Sección 2"
            content={<p>Contenido de la sección 2...</p>}
          />
        </div>
        )}

      {activeSection === 'otra' && (
        <div>
          <Mineria
            title="Sección 3"
            content={<p>Contenido de la sección 3...</p>}
          />
        </div>
        )}
    </div>
    );
};

export default App;
