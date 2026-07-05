import fs from 'node:fs/promises';
import { query } from '../config/db.js';
import { processDocument } from '../ai/ingestionPipeline.js';

export async function createDocument({ userId, file }) {
  const result = await query(
    `INSERT INTO documents (user_id, original_name, stored_path, mime_type)
     VALUES ($1, $2, $3, $4)
     RETURNING id, original_name, mime_type, status, created_at`,
    [userId, file.originalname, file.path, file.mimetype]
  );
  const document = result.rows[0];

  // Fire-and-forget: ingestion runs in the background, status is polled by the client.
  processDocument({
    documentId: document.id,
    userId,
    filePath: file.path,
    mimeType: file.mimetype,
  });

  return document;
}

export async function listDocuments(userId) {
  const result = await query(
    `SELECT id, original_name, mime_type, status, error_message, created_at
     FROM documents WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function deleteDocument({ userId, documentId }) {
  const result = await query(
    'DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING stored_path',
    [documentId, userId]
  );
  const deleted = result.rows[0];
  if (!deleted) return false;

  await fs.unlink(deleted.stored_path).catch(() => {});
  return true;
}
