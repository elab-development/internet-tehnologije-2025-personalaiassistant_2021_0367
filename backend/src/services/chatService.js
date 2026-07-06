import { query } from '../config/db.js';

export async function createConversation(userId) {
  const result = await query(
    `INSERT INTO conversations (user_id) VALUES ($1) RETURNING id, title, created_at`,
    [userId]
  );
  return result.rows[0];
}

export async function listConversations(userId) {
  const result = await query(
    `SELECT id, title, created_at FROM conversations WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function getConversation({ userId, conversationId }) {
  const result = await query(
    `SELECT id, title, created_at FROM conversations WHERE id = $1 AND user_id = $2`,
    [conversationId, userId]
  );
  return result.rows[0];
}

export async function listMessages({ userId, conversationId }) {
  const conversation = await getConversation({ userId, conversationId });
  if (!conversation) return null;

  const result = await query(
    `SELECT id, role, content, sources, created_at FROM messages
     WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [conversationId]
  );
  return result.rows;
}

export async function addMessage({ conversationId, role, content, sources }) {
  const result = await query(
    `INSERT INTO messages (conversation_id, role, content, sources)
     VALUES ($1, $2, $3, $4)
     RETURNING id, role, content, sources, created_at`,
    [conversationId, role, content, sources ? JSON.stringify(sources) : null]
  );
  return result.rows[0];
}
