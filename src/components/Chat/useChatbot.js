// src/hooks/useChatbot.js
import { useState, useCallback } from 'react';

const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (userMessage) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add the user's message to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: userMessage },
      ]);

      // Make the POST request to the API
      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the chatbot API');
      }

      // Process the streaming response
      const reader = response.body.getReader();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the streamed chunk
        const chunk = new TextDecoder().decode(value);
        const parsedChunk = JSON.parse(chunk);

        // Append the assistant's message content
        if (parsedChunk.message?.content) {
          assistantMessage += parsedChunk.message.content;
        }

        // Update the messages state with the latest assistant message
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];

          if (lastMessage?.role === 'assistant') {
            // Update the last assistant message
            return [
              ...prevMessages.slice(0, -1),
              { role: 'assistant', content: assistantMessage },
            ];
          } else {
            // Add a new assistant message
            return [
              ...prevMessages,
              { role: 'assistant', content: assistantMessage },
            ];
          }
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, sendMessage };
};

export default useChatbot;