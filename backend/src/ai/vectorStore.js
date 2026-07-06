import { query } from '../config/db.js';

function toVectorLiteral(embedding) {
  return `[${embedding.join(',')}]`;
}

export async function insertChunks(chunks) {
  for (const chunk of chunks) {
    await query(
      `INSERT INTO document_chunks (document_id, user_id, chunk_index, content, embedding)
       VALUES ($1, $2, $3, $4, $5)`,
      [chunk.documentId, chunk.userId, chunk.index, chunk.content, toVectorLiteral(chunk.embedding)]
    );
  }
}

export async function similaritySearch({ userId, embedding, limit = 5 }) {
  const result = await query(
    `SELECT dc.content, dc.document_id, d.original_name,
            1 - (dc.embedding <=> $1) AS similarity
     FROM document_chunks dc
     JOIN documents d ON d.id = dc.document_id
     WHERE dc.user_id = $2
     ORDER BY dc.embedding <=> $1
     LIMIT $3`,
    [toVectorLiteral(embedding), userId, limit]
  );
  return result.rows;
}
