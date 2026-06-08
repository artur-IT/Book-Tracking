import { act, render, screen } from '@testing-library/react';
import BookList from '../components/BookList';
import AuthProvider from '../hooks/useAuth';
import { db } from '../database/db';
import { sampleBook } from './fixtures/sampleBook';

describe('show BookList component', () => {
  beforeEach(async () => {
    await db.books.clear();
  });

  it('should render', () => {
    render(
      <AuthProvider>
        <BookList />
      </AuthProvider>,
    );

    expect(screen.getByText('Book List')).toBeDefined();
    expect(screen.getByPlaceholderText('Search by title or author')).toBeDefined();
  });

  it('should visible ISBN, Pages, Rating', async () => {
    render(
      <AuthProvider>
        <BookList />
      </AuthProvider>,
    );

    await db.books.put(sampleBook);

    await screen.findByText(`ISBN: ${sampleBook.isbn}`);
    await screen.findByText(`Pages: ${sampleBook.pages}`);
    await screen.findByText(`Rating: ${sampleBook.rating}`);
  });
});
