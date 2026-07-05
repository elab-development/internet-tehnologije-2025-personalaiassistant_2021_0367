import 'dotenv/config';

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
  ollamaChatModel: process.env.OLLAMA_CHAT_MODEL ?? 'llama3.1',
  ollamaEmbeddingModel: process.env.OLLAMA_EMBEDDING_MODEL ?? 'nomic-embed-text',
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS ?? 768),
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB ?? 20),
};
