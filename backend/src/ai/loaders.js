import fs from 'node:fs/promises';
import path from 'node:path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export async function extractText(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();

  if (mimeType === 'application/pdf' || ext === '.pdf') {
    const buffer = await fs.readFile(filePath);
    const { text } = await pdfParse(buffer);
    return text;
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === '.docx'
  ) {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  }

  if (mimeType === 'text/plain' || ext === '.txt' || ext === '.md') {
    return fs.readFile(filePath, 'utf-8');
  }

  throw new Error(`Unsupported file type: ${mimeType || ext}`);
}
