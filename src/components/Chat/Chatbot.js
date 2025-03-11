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

      // Create a placeholder for the assistant's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: '' },
      ]);

      // Make the API request to the backend
      const response = await fetch('https://banbajio-backend-753741223620.us-central1.run.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch response: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = new TextDecoder().decode(value);

        // Skip empty chunks
        if (!chunk.trim()) {
          continue;
        }

        try {
          const parsedChunk = JSON.parse(chunk);

          // Check if the chunk contains the assistant's message content
          if (parsedChunk.message?.role === 'assistant' && parsedChunk.message.content) {
            assistantMessage += parsedChunk.message.content;

            // Update the assistant's message incrementally
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];

              if (lastMessage?.role === 'assistant') {
                return [
                  ...prevMessages.slice(0, -1),
                  { role: 'assistant', content: assistantMessage },
                ];
              } else {
                return [
                  ...prevMessages,
                  { role: 'assistant', content: assistantMessage },
                ];
              }
            });
          }
        } catch (parseError) {
          console.error('Error parsing chunk:', chunk, parseError);
        }
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
