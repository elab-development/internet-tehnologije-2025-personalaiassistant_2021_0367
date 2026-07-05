import { ZodError } from 'zod';
import multer from 'multer';

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.issues });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error' });
}
