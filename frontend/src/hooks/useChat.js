import { useCallback, useEffect, useState } from 'react';
import {
  createConversation,
  listConversations,
  listMessages,
  streamMessage,
} from '../services/chatApi.js';

export function useChat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    listConversations().then(setConversations);
  }, []);

  const selectConversation = useCallback(async (id) => {
    setActiveId(id);
    setMessages(await listMessages(id));
  }, []);

  const newConversation = useCallback(async () => {
    const conversation = await createConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (content) => {
      if (!activeId) return;
      const userMessage = { id: `local-${Date.now()}`, role: 'user', content };
      const assistantMessage = { id: `local-assistant-${Date.now()}`, role: 'assistant', content: '' };
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setSending(true);

      await streamMessage(activeId, content, {
        onToken: (token) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { ...last, content: last.content + token };
            return updated;
          });
        },
        onDone: (finalMessage) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = finalMessage;
            return updated;
          });
          setSending(false);
        },
        onError: () => setSending(false),
      });
    },
    [activeId]
  );

  return { conversations, activeId, messages, sending, selectConversation, newConversation, sendMessage };
}
