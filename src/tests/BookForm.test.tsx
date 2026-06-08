import { render, screen } from '@testing-library/react';
import BookForm from '../components/BookForm';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

describe('BookForm component', () => {
  let setShowBookForm: (show: boolean) => void;
  beforeEach(() => {
    setShowBookForm = vi.fn();
    render(<BookForm setShowBookForm={setShowBookForm} />);
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
    // fill data form before clicking Add Book button
    await userEvent.type(screen.getByPlaceholderText('max. 70 characters'), 'Test Book');
    await userEvent.type(screen.getByPlaceholderText('max. 30 characters'), 'Test Author');
    await userEvent.type(screen.getByPlaceholderText('max. 13 digits'), '1234567890123');
    await userEvent.type(screen.getByPlaceholderText('max. 3000 pages'), '100');
    await userEvent.type(screen.getByPlaceholderText('1 - 5'), '5');
    await userEvent.click(screen.getByRole('button', { name: 'Add Book' }));
    await waitFor(() => {
      expect(setShowBookForm).toHaveBeenCalledWith(false);
    });
  });
});
