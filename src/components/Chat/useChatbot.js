import { useState, useCallback } from 'react';

const useChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      content: '¡Hola! Soy el BB BOT, tu agente virtual de servicio al cliente. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (userMessage) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add the user's message to the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: userMessage },
      ]);

      // Make the API request to the new endpoint
      const response = await fetch(
        'https://banbajio-backend-753741223620.us-central1.run.app/chat?', // Cloud Run URL
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage, // Updated payload structure
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // attempt to get error details from the response
        throw new Error(`Failed to fetch response: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      // Parse the response
      const data = await response.json();

      // Extract the assistant's message from the response
      const assistantMessage = data.message; // Assuming the response has a "message" field

      // Add the assistant's message to the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: assistantMessage },
      ]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, sendMessage };
};

export default useChatbot;
