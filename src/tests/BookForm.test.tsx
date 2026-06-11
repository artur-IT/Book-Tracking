import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookForm from '../components/BookForm';
import { useAuth } from '../hooks/useAuth';
import { AuthWrapper } from './helpers/renderWithAuth';

function ShowBookFormFlag() {
  const { showBookForm } = useAuth();
  return <span data-testid="show-book-form">{String(showBookForm)}</span>;
}

function OpenBookFormOnMount() {
  const { setShowBookForm } = useAuth();

  useEffect(() => {
    setShowBookForm(true);
  }, [setShowBookForm]);

  return null;
}

function renderBookForm() {
  render(
    <AuthWrapper>
      <OpenBookFormOnMount />
      <ShowBookFormFlag />
      <BookForm />
    </AuthWrapper>,
  );
}

describe('BookForm component', () => {
  beforeEach(() => {
    renderBookForm();
  });

  it('should display all form fields and buttons', () => {
    expect(screen.getByText('New Book'));
    expect(screen.getByPlaceholderText('max. 70 characters'));
    expect(screen.getByPlaceholderText('max. 30 characters'));
    expect(screen.getByPlaceholderText('max. 13 digits'));
    expect(screen.getByPlaceholderText('max. 3000 pages'));
    expect(screen.getByPlaceholderText('1 - 5'));
    expect(screen.getByRole('button', { name: 'Add Book' }));
    expect(screen.getByRole('button', { name: 'Cancel' }));
  });

  it('should change state to false when Add Book button is clicked', async () => {
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('max. 70 characters'), 'Test Book');
    await user.type(screen.getByPlaceholderText('max. 30 characters'), 'Test Author');
    await user.type(screen.getByPlaceholderText('max. 13 digits'), '1234567890123');
    await user.type(screen.getByPlaceholderText('max. 3000 pages'), '100');
    await user.type(screen.getByPlaceholderText('1 - 5'), '5');
    await user.click(screen.getByRole('button', { name: 'Add Book' }));

    await waitFor(() => {
      expect(screen.getByTestId('show-book-form').textContent).toBe('false');
    });
  });

  it('should change state to false when Cancel button is clicked', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByTestId('show-book-form').textContent).toBe('false');
  });
});
