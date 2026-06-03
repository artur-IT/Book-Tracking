import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useRef,
  useEffect,
} from 'react';
import { db } from '../database/db';

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
  importProgress: {
    imported: number;
    total: number;
    isImporting: boolean;
  } | null;
  handleLogin: (login: string, password: string) => boolean;
  handleLogout: () => void;
  books: Book[];
  setBooks: (books: Book[]) => void;
};

const UserContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used inside UserProvider');
  }
  return context;
}

//------------------

let largeBooksPromise: Promise<LargeBooksData> | null = null;

function loadLargeBooks(): Promise<LargeBooksData> {
  largeBooksPromise ??= import('../database/largeBooks.json').then(
    (module) => module.default as LargeBooksData,
  );
  return largeBooksPromise;
}

const user = {
  login: 'art',
  password: 'mat',
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  // -= START -- load books in small packages
  const BATCH_SIZE = 5000;

  async function importBooksWithFastStart(
    onProgress: (n: number, total: number) => void,
  ) {
    const largeBooks = await loadLargeBooks();
    const all = largeBooks.books;
    const total = all.length;
    const FIRST = 10;

    await db.books.bulkPut(all.slice(0, FIRST));
    onProgress(FIRST, total);

    for (let i = FIRST; i < total; i += BATCH_SIZE) {
      const chunk = all.slice(i, i + BATCH_SIZE);
      await db.books.bulkPut(chunk);
      onProgress(Math.min(i + chunk.length, total), total);
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  const [importProgress, setImportProgress] = useState<{
    imported: number;
    total: number;
    isImporting: boolean;
  } | null>(null);

  const importAbortRef = useRef({ cancelled: false });

  async function startBackgroundImport() {
    const largeBooks = await loadLargeBooks();
    const count = await db.books.count();
    if (count >= largeBooks.books.length) {
      // DB already full from last session — skip
      return;
    }

    importAbortRef.current.cancelled = false;
    setImportProgress({
      imported: count,
      total: largeBooks.books.length,
      isImporting: true,
    });

    try {
      await importBooksWithFastStart((imported, total) => {
        setImportProgress({ imported, total, isImporting: imported < total });
      });
    } catch (e) {
      console.error(e);
    } finally {
      setImportProgress((p) => (p ? { ...p, isImporting: false } : null));
    }
  }

  // -- END --

  // async function sampleBooksToDexie() {
  //   try {
  //     await db.books.bulkPut(largeBooks.books);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  useEffect(() => {
    void db.books.clear();
  }, []);

  const handleLogin = (login: string, password: string) => {
    if (login === user.login && password === user.password) {
      setIsLoggedIn(true);
      startBackgroundImport();
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setImportProgress(null);
    await db.books.clear();
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        importProgress,
        handleLogin,
        handleLogout,
        books,
        setBooks,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
