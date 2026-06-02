import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import sampleBooks from '../sampleBooks.json';
import { db } from '../database/db';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: number;
  pages: number;
  rating: number;
}
type AuthContextValue = {
  isLoggedIn: boolean;
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

const user = {
  login: 'art',
  password: 'mat',
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [books, setBooks] = useState(sampleBooks.books);

  async function sampleBooksToDixie() {
    await db.books.clear();
    try {
      for (const book of sampleBooks.books) {
        await db.books.put(book);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    sampleBooksToDixie();
  }, []);

  const handleLogin = (login: string, password: string) => {
    if (login === user.login && password === user.password) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.href = '/Book-Tracking/';
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
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
