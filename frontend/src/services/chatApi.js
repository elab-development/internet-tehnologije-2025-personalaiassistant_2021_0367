import { api } from './api.js';

export async function createConversation() {
  const { data } = await api.post('/conversations');
  return data;
}

export async function listConversations() {
  const { data } = await api.get('/conversations');
  return data;
}

export async function listMessages(conversationId) {
  const { data } = await api.get(`/conversations/${conversationId}/messages`);
  return data;
}

export async function streamMessage(conversationId, content, { onToken, onDone, onError }) {
  const token = localStorage.getItem('pkb_token');
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => ({}));
    onError?.(data.error ?? 'Request failed');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary;
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      const rawEvent = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const line = rawEvent.replace(/^data:\s*/, '');
      if (!line) continue;

      const payload = JSON.parse(line);
      if (payload.type === 'token') onToken?.(payload.token);
      if (payload.type === 'done') onDone?.(payload.message);
      if (payload.type === 'error') onError?.(payload.error);
    }
  }
}
