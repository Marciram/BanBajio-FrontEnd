import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import './styles/global.scss';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatScreen />} />
      </Routes>
    </Router>
  );
};

export default App;