import React, { useState, useEffect } from 'react';
import useChatbot from './useChatbot';
import Message from './Message';
import SendIcon from '../../images/send.svg';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isContactMode, setIsContactMode] = useState(false);
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    shouldContactAgent 
  } = useChatbot();

  // Función para formatear el texto
  const formatMessage = (text) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*/g, '<br />');
    formattedText = formattedText.replace(/\n/g, '<br />');
    return formattedText;
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Si está en modo contacto, no envía el mensaje
    if (isContactMode) return;

    await sendMessage(inputText);
    setInputText('');
  };

  const handleContactAgent = () => {
    // Cambia al modo de contacto
    setIsContactMode(true);
    
    // Limpia input
    setInputText('');

    // Abre el modal inmediatamente
    setIsContactModalOpen(true);

    // Añade un mensaje de intención de contactar agente
    const contactAgentMessage = {
      role: 'user',
      content: 'Necesito hablar con un agente humano.'
    };

    // Puedes agregar aquí cualquier lógica adicional para registrar la solicitud de contacto
  };

  const ContactAgentModal = () => {
    return (
      <div className="contact-agent-modal">
        <div className="contact-agent-modal-content">
          <h2>Contactar con un Agente</h2>
          <p>Un agente humano se pondrá en contacto contigo pronto.</p>
          <p>Tiempo estimado de espera: 5-10 minutos</p>
          <div className="contact-details">
            <p>📞 Teléfono: 800 47 10 400 </p>
          </div>
          <button onClick={() => {
            setIsContactModalOpen(false);
            setIsContactMode(false);
          }}>
            Cerrar
          </button>
        </div>
      </div>
    );
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

        {/* Si está en modo contacto, no muestra mensajes nuevos */}
        {isContactMode && (
          <Message
            text="Esperando a un agente humano..."
            sender="agent"
          />
        )}
      </div>

      {/* Botón de Contactar Agente siempre visible */}
      <button 
        className="contact-agent-btn"
        onClick={handleContactAgent}
        disabled={isContactMode}
      >
        Contactar con un agente
      </button>

      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isContactMode ? "Contacto con agente en proceso..." : "Escribe tu mensaje..."}
          disabled={isContactMode}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={isLoading || isContactMode}
        >
          <img src={SendIcon} alt="Enviar" />
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Modal de Contacto con Agente */}
      {isContactModalOpen && <ContactAgentModal />}
    </div>
  );
};

export default Chat;