import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Sidebar({ conversations, activeId, onSelect, onNew }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span>{user?.email}</span>
        <button onClick={logout}>Odjava</button>
      </div>
      <Link to="/documents" className="sidebar-link">
        Dokumenti
      </Link>
      <button className="new-conversation" onClick={onNew}>
        + Nova konverzacija
      </button>
      <ul className="conversation-list">
        {conversations.map((c) => (
          <li
            key={c.id}
            className={c.id === activeId ? 'active' : ''}
            onClick={() => onSelect(c.id)}
          >
            {c.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
