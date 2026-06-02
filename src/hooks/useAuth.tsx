import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import sampleBooks from '../database/sampleBooks.json';
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

//--------------------------------
const millionBooks: Book[] = [];

const generateBooks = () => {
  for (let i = 0; i < 10000; i++) {
    millionBooks.push({
      id: Math.floor(Math.random() * 1000000000000),
      title: `Book ${i}`,
      author: `Author ${i}`,
      isbn: Math.floor(Math.random() * 1000000000000),
      pages: Math.floor(Math.random() * 1000),
      rating: Math.floor(Math.random() * 5),
    });
  }
};
generateBooks();
// ---------------------------

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [books, setBooks] = useState(sampleBooks.books);

  async function sampleBooksToDixie() {
    await db.books.clear();
    try {
      for (const book of millionBooks) {
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
