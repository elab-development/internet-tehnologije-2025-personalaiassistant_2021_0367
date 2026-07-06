import {
  createConversation,
  listConversations,
  getConversation,
  listMessages,
  addMessage,
} from '../services/chatService.js';
import { answerQuestion } from '../ai/ragChain.js';

export async function create(req, res, next) {
  try {
    const conversation = await createConversation(req.user.id);
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const conversations = await listConversations(req.user.id);
    res.json(conversations);
  } catch (err) {
    next(err);
  }
}

export async function messages(req, res, next) {
  try {
    const rows = await listMessages({ userId: req.user.id, conversationId: req.params.id });
    if (rows === null) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const conversationId = req.params.id;
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const conversation = await getConversation({ userId: req.user.id, conversationId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const history = await listMessages({ userId: req.user.id, conversationId });
    await addMessage({ conversationId, role: 'user', content });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let fullAnswer = '';
    let sources = [];

    for await (const event of answerQuestion({ userId: req.user.id, question: content, history })) {
      if (event.type === 'token') {
        fullAnswer += event.token;
        res.write(`data: ${JSON.stringify({ type: 'token', token: event.token })}\n\n`);
      } else if (event.type === 'sources') {
        sources = event.sources;
      }
    }

    const assistantMessage = await addMessage({
      conversationId,
      role: 'assistant',
      content: fullAnswer,
      sources,
    });

    res.write(`data: ${JSON.stringify({ type: 'done', message: assistantMessage })}\n\n`);
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      next(err);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    }
  }
}
