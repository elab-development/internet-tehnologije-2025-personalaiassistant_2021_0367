import { api } from './api.js';

export async function listDocuments() {
  const { data } = await api.get('/documents');
  return data;
}

export async function uploadDocument(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });
  return data;
}

export async function deleteDocument(id) {
  await api.delete(`/documents/${id}`);
}
