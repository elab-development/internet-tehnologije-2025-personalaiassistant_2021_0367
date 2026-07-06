import axios from 'axios';
import { env } from '../config/env.js';

const http = axios.create({ baseURL: env.ollamaBaseUrl, timeout: 120_000 });

export async function embedText(text) {
  const { data } = await http.post('/api/embeddings', {
    model: env.ollamaEmbeddingModel,
    prompt: text,
  });
  return data.embedding;
}

export async function embedBatch(texts) {
  const embeddings = [];
  for (const text of texts) {
    embeddings.push(await embedText(text));
  }
  return embeddings;
}

export async function* streamChat(messages) {
  const response = await http.post(
    '/api/chat',
    { model: env.ollamaChatModel, messages, stream: true },
    { responseType: 'stream' }
  );

  let buffer = '';
  for await (const chunk of response.data) {
    buffer += chunk.toString('utf-8');
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line) continue;
      const parsed = JSON.parse(line);
      if (parsed.message?.content) {
        yield parsed.message.content;
      }
      if (parsed.done) {
        return;
      }
    }
  }
}
