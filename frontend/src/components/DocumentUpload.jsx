import { useRef, useState } from 'react';
import { uploadDocument } from '../services/documentsApi.js';

export function DocumentUpload({ onUploaded }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  async function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    setError('');
    setProgress(0);
    try {
      const document = await uploadDocument(file, setProgress);
      onUploaded(document);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Upload failed');
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div
      className="document-upload"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {progress !== null ? (
        <p>Upload... {progress}%</p>
      ) : (
        <p>Prevuci fajl ovde ili klikni da izabereš (PDF, DOCX, TXT)</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
