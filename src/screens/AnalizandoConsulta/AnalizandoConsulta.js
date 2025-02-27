import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnalizandoConsulta.scss';

const CrearConsulta = () => {
  const [consulta, setConsulta] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Consulta creada: ${consulta}`);
    navigate('/'); // Redirige a la página principal después de crear la consulta
  };
  const handleCrearConsulta = () => {
    navigate('/crear-consulta');
  };

  return (
    <div className="container">
      <h1 className="text">Crear consulta</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Escribe tu consulta aquí..."
        />
        
      </form>
      <button type="submit" className="button">
          Enviar consulta
        </button>
    </div>
  );
};

export default CrearConsulta;