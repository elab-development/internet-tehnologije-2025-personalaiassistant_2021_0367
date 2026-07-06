import { embedText, streamChat } from './ollamaClient.js';
import { similaritySearch } from './vectorStore.js';

const SYSTEM_PROMPT = `You are a helpful assistant answering questions using only the provided context
from the user's personal knowledge base. If the context does not contain the answer, say you don't know.
Always be concise. Cite sources by their document name in square brackets, e.g. [report.pdf].`;

function buildContextBlock(matches) {
  return matches
    .map((m, i) => `Source ${i + 1} (${m.original_name}):\n${m.content}`)
    .join('\n\n---\n\n');
}

export async function* answerQuestion({ userId, question, history }) {
  const queryEmbedding = await embedText(question);
  const matches = await similaritySearch({ userId, embedding: queryEmbedding, limit: 5 });

  const contextBlock = matches.length
    ? buildContextBlock(matches)
    : 'No relevant documents were found in the knowledge base.';

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    {
      role: 'user',
      content: `Context:\n${contextBlock}\n\nQuestion: ${question}`,
    },
  ];

  const sources = [...new Map(matches.map((m) => [m.document_id, m.original_name])).values()];

  for await (const token of streamChat(messages)) {
    yield { type: 'token', token };
  }
  yield { type: 'sources', sources };
}
