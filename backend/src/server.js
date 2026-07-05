import fs from 'node:fs';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { runMigrations } from './db/migrate.js';

fs.mkdirSync(env.uploadDir, { recursive: true });

async function waitForDatabase(retries = 20, delayMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      console.log(`Waiting for database... (${attempt}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Database did not become ready in time');
}

async function start() {
  if (process.env.AUTO_MIGRATE !== 'false') {
    await waitForDatabase();
    await runMigrations();
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
