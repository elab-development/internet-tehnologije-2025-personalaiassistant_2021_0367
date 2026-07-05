import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
});

export async function splitIntoChunks(text) {
  const docs = await splitter.createDocuments([text]);
  return docs.map((doc) => doc.pageContent).filter((chunk) => chunk.trim().length > 0);
}
