import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import './Chat.scss';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Función para enviar un mensaje al servidor Python
  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    // Agregar el mensaje del usuario al chat
    const userMessage = { text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');

    try {
      // Enviar el mensaje al servidor Python
      const response = await axios.post('http://localhost:5000/chat', {
        message: inputText,
      });

      // Agregar la respuesta del agente virtual al chat
      const agentMessage = { text: response.data.response, sender: 'agent' };
      setMessages((prevMessages) => [...prevMessages, agentMessage]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      const agentMessage = { text: 'Hubo un error al procesar tu mensaje.', sender: 'agent' };
      setMessages((prevMessages) => [...prevMessages, agentMessage]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <Message key={index} text={message.text} sender={message.sender} />
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;