import { query } from '../config/db.js';
import { extractText } from './loaders.js';
import { splitIntoChunks } from './textSplitter.js';
import { embedBatch } from './ollamaClient.js';
import { insertChunks } from './vectorStore.js';

export async function processDocument({ documentId, userId, filePath, mimeType }) {
  try {
    const text = await extractText(filePath, mimeType);
    const chunks = await splitIntoChunks(text);

    if (chunks.length === 0) {
      throw new Error('No extractable text found in document');
    }

    const embeddings = await embedBatch(chunks);

    await insertChunks(
      chunks.map((content, index) => ({
        documentId,
        userId,
        index,
        content,
        embedding: embeddings[index],
      }))
    );

    await query("UPDATE documents SET status = 'ready' WHERE id = $1", [documentId]);
  } catch (err) {
    console.error(`Ingestion failed for document ${documentId}:`, err);
    await query('UPDATE documents SET status = $2, error_message = $3 WHERE id = $1', [
      documentId,
      'failed',
      err.message,
    ]);
  }
}
