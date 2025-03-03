import React from 'react';
import Chat from '../../components/Chat/Chat';
import Chatbot from '../../components/Chat/Chatbot';
import './ChatScreen.scss';

const ChatScreen = () => {
  return (
    <div className="chat-screen">
      <h1>Chatea con BB Bot!</h1>
      <Chatbot />
    </div>
  );
};

export default ChatScreen;