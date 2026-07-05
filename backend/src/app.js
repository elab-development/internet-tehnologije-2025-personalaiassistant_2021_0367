import express from 'express';
import cors from 'cors';
import { healthCheck } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', async (req, res) => {
    try {
      await healthCheck();
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'db unavailable' });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/documents', documentsRoutes);
  app.use('/api/conversations', chatRoutes);

  app.use(errorHandler);

  return app;
}
