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
      // Add the user message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: userMessage },
      ]);

      const response = await fetch(
        'https://proxy-frontend-753741223620.us-central1.run.app/api/chat', // Replace with your proxy server URL
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'bb-bot',
            messages: [{ role: 'user', content: userMessage }],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch response: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = new TextDecoder().decode(value);
        try {
          const parsedChunk = JSON.parse(chunk);

          if (parsedChunk.message?.content) {
            assistantMessage += parsedChunk.message.content;
          }

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
        } catch (parseError) {
          console.error("error parsing chunk:", chunk, parseError);
        }
      }
    } catch (err) {
      console.error("Request error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, sendMessage };
};

export default useChatbot;
