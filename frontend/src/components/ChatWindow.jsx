import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble.jsx';
import { ChatInput } from './ChatInput.jsx';

export function ChatWindow({ messages, onSend, sending }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} sources={m.sources} />
        ))}
        <div ref={endRef} />
      </div>
      <ChatInput onSend={onSend} disabled={sending} />
    </div>
  );
}
