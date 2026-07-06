import { deleteDocument } from '../services/documentsApi.js';

const STATUS_LABEL = {
  processing: 'Obrada u toku...',
  ready: 'Spremno',
  failed: 'Greška',
};

export function DocumentList({ documents, onDeleted }) {
  async function handleDelete(id) {
    await deleteDocument(id);
    onDeleted(id);
  }

  if (documents.length === 0) {
    return <p className="empty-state">Još nema dokumenata. Otpremi prvi fajl.</p>;
  }

  return (
    <ul className="document-list">
      {documents.map((doc) => (
        <li key={doc.id} className={`document-item status-${doc.status}`}>
          <span className="document-name">{doc.original_name}</span>
          <span className="document-status">{STATUS_LABEL[doc.status] ?? doc.status}</span>
          <button onClick={() => handleDelete(doc.id)} aria-label="Obriši dokument">
            Obriši
          </button>
        </li>
      ))}
    </ul>
  );
}
