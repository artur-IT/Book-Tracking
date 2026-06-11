import { createContext, useContext, useState, type ReactNode, useRef } from 'react';
import initializeEncryptedDatabase from '../database/db';
import type { Dexie } from 'dexie';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: number;
  pages: number;
  rating: number;
  createdAt: string;
}

type LargeBooksData = { books: Book[] };

type AuthContextValue = {
  isLoggedIn: boolean;
  showBookForm: boolean;
  setShowBookForm: (show: boolean) => void;
  importProgress: {
    imported: number;
    total: number;
    isImporting: boolean;
  } | null;
  handleLogin: (login: string, password: string) => Promise<boolean>;
  handleLogout: () => void;
  db: Dexie | null;
  booksCache: Book[];
  addBookToCache: (book: Book) => void;
  updateBookInCache: (book: Book) => void;
  deleteBookFromCache: (id: number) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
};

const UserContext = createContext<AuthContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used inside UserProvider');
  }
  return context;
}

let largeBooksPromise: Promise<LargeBooksData> | null = null;

// import 200 000 books
function loadLargeBooks(): Promise<LargeBooksData> {
  largeBooksPromise ??= import('../database/largeBooks.json').then((module) => module.default as LargeBooksData);
  return largeBooksPromise;
}

const user = {
  login: 'art',
  password: 'mat',
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [db, setDB] = useState<Dexie | null>(null);
  const [booksCache, setBooksCache] = useState<Book[]>([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Books Cache for fast searching
  async function loadBooksIntoCache(db: Dexie) {
    const all = await db.table('books').orderBy('createdAt').reverse().toArray();
    setBooksCache(all);
    return all;
  }

  // Add book to cache after adding to database
  function addBookToCache(book: Book) {
    setBooksCache((prev) => [book, ...prev]);
  }

  function updateBookInCache(book: Book) {
    setBooksCache((prev) => prev.map((b) => (b.id === book.id ? book : b)));
  }

  function deleteBookFromCache(id: number) {
    setBooksCache((prev) => prev.filter((book) => book.id !== id));
  }

  const handleLogin = async (login: string, password: string) => {
    if (login === user.login && password === user.password) {
      setIsLoggedIn(true);
      const db = await initializeEncryptedDatabase(password);
      setDB(db);
      await loadBooksIntoCache(db);
      await startBackgroundImport(db);
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setImportProgress(null);
    setBooksCache([]);
    await db?.table('books').clear();
  };

  // -= START -- load books in small packages
  const BATCH_SIZE = 5000;

  // show first 10 books to user, then wait for loading all books
  async function importBooksWithFastStart(db: Dexie, onProgress: (n: number, total: number) => void) {
    const largeBooks = await loadLargeBooks();
    const all = largeBooks.books;
    const total = all.length;
    const FIRST = 10;

    await db.table('books').bulkPut(all.slice(0, FIRST));
    onProgress(FIRST, total);

    for (let i = FIRST; i < total; i += BATCH_SIZE) {
      const chunk = all.slice(i, i + BATCH_SIZE);
      await db?.table('books').bulkPut(chunk);
      onProgress(Math.min(i + chunk.length, total), total);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  // -- END --

  // for showing loading progres to user
  const [importProgress, setImportProgress] = useState<{
    imported: number;
    total: number;
    isImporting: boolean;
  } | null>(null);

  const importAbortRef = useRef({ cancelled: false });

  async function startBackgroundImport(db: Dexie) {
    const largeBooks = await loadLargeBooks();
    const count = await db.table('books').count();
    if (count && count >= largeBooks.books.length) {
      // DB already full from last session — skip
      return;
    }

    importAbortRef.current.cancelled = false;
    setImportProgress({
      imported: count ?? 0,
      total: largeBooks.books.length,
      isImporting: true,
    });

    try {
      await importBooksWithFastStart(db, (imported, total) => {
        setImportProgress({ imported, total, isImporting: imported < total });

        if (imported === 10) {
          void loadBooksIntoCache(db);
        }
      });
      await loadBooksIntoCache(db);
    } catch (e) {
      console.error(e);
    } finally {
      setImportProgress((p) => (p ? { ...p, isImporting: false } : null));
    }
  }

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        importProgress,
        handleLogin,
        handleLogout,
        db,
        booksCache,
        addBookToCache,
        updateBookInCache,
        showBookForm,
        setShowBookForm,
        deleteBookFromCache,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
