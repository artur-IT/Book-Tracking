import type { Book } from '../../database/db';

export const sampleBook: Book = {
  id: 1,
  title: 'The Hobbit',
  author: 'J.R.R. Tolkien',
  isbn: 9780261103344,
  pages: 310,
  rating: 5,
  createdAt: '2024-06-01T12:00:00.000Z',
};

export async function seedSampleBook() {
  const { db } = await import('../../database/db');
  await db.books.put(sampleBook);
}
