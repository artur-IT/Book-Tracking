import { screen } from '@testing-library/react';
import BookList from '../components/BookList';
import { sampleBook } from './fixtures/sampleBook';
import { renderWithAuth } from './helpers/renderWithAuth';

describe('BookList component', () => {
  it('should display Book List and Search field', () => {
    renderWithAuth(<BookList />);

    expect(screen.getByText('Book List')).toBeDefined();
    expect(screen.getByPlaceholderText('Search by title or author')).toBeDefined();
  });

  it('should display ISBN, Pages, Rating', async () => {
    renderWithAuth(<BookList />, [sampleBook]);

    expect(await screen.findByText(`ISBN: ${sampleBook.isbn}`)).toBeDefined();
    expect(screen.getByText(`Pages: ${sampleBook.pages}`)).toBeDefined();
    expect(screen.getByText(`Rating: ${sampleBook.rating}`)).toBeDefined();
  });
});
