import { useState, useCallback } from 'react';

const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (userMessage) => {
    setIsLoading(true);
    setError(null);

    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: userMessage },
      ]);

      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'BB-BOT',
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reponse');
      }

      const reader = response.body.getReader();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = new TextDecoder().decode(value);
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