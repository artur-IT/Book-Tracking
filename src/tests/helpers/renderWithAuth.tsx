import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { render } from '@testing-library/react';
import AuthProvider, { useAuth, type Book } from '../../hooks/useAuth';

function SeedBooks({ books }: { books: Book[] }) {
  const { addBookToCache } = useAuth();
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;

    books.forEach((book) => addBookToCache(book));
    seededRef.current = true;
  }, [books, addBookToCache]);

  return null;
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderWithAuth(ui: ReactElement, books: Book[] = []) {
  return render(
    <AuthProvider>
      {books.length > 0 && <SeedBooks books={books} />}
      {ui}
    </AuthProvider>,
  );
}

export function AuthWrapper({ children, books = [] }: { children: ReactNode; books?: Book[] }) {
  return (
    <AuthProvider>
      {books.length > 0 && <SeedBooks books={books} />}
      {children}
    </AuthProvider>
  );
}
