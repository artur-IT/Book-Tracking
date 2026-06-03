import { Dexie, type EntityTable } from 'dexie';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: number;
  pages: number;
  rating: number;
  createdAt: string;
}

const db = new Dexie('Books') as Dexie & {
  books: EntityTable<Book, 'id'>;
};

db.version(1).stores({
  books: '++id, title, author, isbn, pages, rating, createdAt',
});

export type { Book };
export { db };
