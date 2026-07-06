import { useCallback, useEffect, useState } from 'react';
import { listDocuments } from '../services/documentsApi.js';
import { DocumentUpload } from '../components/DocumentUpload.jsx';
import { DocumentList } from '../components/DocumentList.jsx';

export default function Documents() {
  const [documents, setDocuments] = useState([]);

  const refresh = useCallback(async () => {
    setDocuments(await listDocuments());
  }, []);

  useEffect(() => {
    refresh();
    const hasProcessing = () => documents.some((d) => d.status === 'processing');
    const interval = setInterval(() => {
      if (hasProcessing()) refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [refresh, documents]);

  return (
    <div className="page documents-page">
      <h1>Moji dokumenti</h1>
      <DocumentUpload onUploaded={(doc) => setDocuments((prev) => [doc, ...prev])} />
      <DocumentList
        documents={documents}
        onDeleted={(id) => setDocuments((prev) => prev.filter((d) => d.id !== id))}
      />
    </div>
  );
}
