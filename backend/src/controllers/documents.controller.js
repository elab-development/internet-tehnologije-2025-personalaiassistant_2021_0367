import { createDocument, listDocuments, deleteDocument } from '../services/documentService.js';

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const document = await createDocument({ userId: req.user.id, file: req.file });
    res.status(201).json(document);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const documents = await listDocuments(req.user.id);
    res.json(documents);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const deleted = await deleteDocument({ userId: req.user.id, documentId: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
