import { Dexie, type EntityTable } from 'dexie';
import { applyEncryptionMiddleware, clearAllTables } from 'dexie-encrypted';
import { cryptoOptions } from 'dexie-encrypted';
import { deriveKeyFromPassword } from '../scripts/generateKeyFromPass';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: number;
  pages: number;
  rating: number;
  createdAt: string;
}

async function initializeEncryptedDatabase(password: string) {
  // Generate encryption key from password
  const encryptionKey = await deriveKeyFromPassword(password);

  const db = new Dexie('Books') as Dexie & {
    books: EntityTable<Book, 'id'>;
  };

  // Configuration of encryption middleware
  applyEncryptionMiddleware(
    db,
    encryptionKey,
    {
      // NON_INDEXED_FIELDS option encrypts everything except indexes (e.g. except id field)
      books: cryptoOptions.NON_INDEXED_FIELDS,
    },
    clearAllTables, // Function to reset database in case of wrong key (e.g. reset database)
  );

  db.version(2).stores({
    // decrypted fields
    books: '++id, title, author,createdAt',
  });

  await db.open();
  return db;
}

export type { Book };
export default initializeEncryptedDatabase;
