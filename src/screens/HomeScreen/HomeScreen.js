import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.scss';

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleCrearConsulta = () => {
    navigate('/crear-consulta');
  };

  return (
    <div className="container">
      <h1 className="text">¡Bienvenido!</h1>
      <button className="button" onClick={handleCrearConsulta}>
        Crear consulta
      </button>
    </div>
  );
};

export default HomeScreen;