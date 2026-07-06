import { useChat } from '../hooks/useChat.js';
import { Sidebar } from '../components/Sidebar.jsx';
import { ChatWindow } from '../components/ChatWindow.jsx';

export default function Chat() {
  const {
    conversations,
    activeId,
    messages,
    sending,
    selectConversation,
    newConversation,
    sendMessage,
  } = useChat();

  return (
    <div className="chat-page">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={newConversation}
      />
      {activeId ? (
        <ChatWindow messages={messages} onSend={sendMessage} sending={sending} />
      ) : (
        <div className="chat-placeholder">
          <p>Izaberi konverzaciju ili započni novu.</p>
        </div>
      )}
    </div>
  );
}
