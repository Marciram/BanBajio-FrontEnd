import React, { useState } from 'react';
import useChatbot from './useChatbot'; // Importa el hook
import Message from './Message';
import SendIcon from '../../images/send.svg';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, error, sendMessage } = useChatbot(); // Usa el hook
  // Función para formatear el texto
  const formatMessage = (text) => {
    // Convertir **texto** a <strong>texto</strong>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    // Convertir * a <br />
    formattedText = formattedText.replace(/\*/g, '<br />');
  
    // Convertir saltos de línea (\n) a <br />
    formattedText = formattedText.replace(/\n/g, '<br />');
  
    return formattedText;
  };
  


  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Llama a la función sendMessage del hook
    await sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <Message
          key={index}
          text={<span dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />}
          sender={message.role === 'user' ? 'user' : 'agent'}
        />
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          <img src={SendIcon} alt="Enviar" />
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Chat;