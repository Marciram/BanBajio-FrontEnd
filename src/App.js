import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ChatScreen from './screens/ChatScreen/ChatScreen'; import './styles/App.scss'; 
import imagen from './images/background.png'; import Chat from './components/Chat/Chat';
function App() 
{ return (<div className="App"> <Chat /> </div>); } 
export default App;