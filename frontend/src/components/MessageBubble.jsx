import ReactMarkdown from 'react-markdown';

export function MessageBubble({ role, content, sources }) {
  return (
    <div className={`message-bubble message-${role}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
      {sources?.length > 0 && (
        <div className="message-sources">
          Izvori: {sources.join(', ')}
        </div>
      )}
    </div>
  );
}
