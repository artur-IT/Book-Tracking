import { type CSSProperties } from 'react';
import type { Book } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';

const style: {
  buttons: CSSProperties;
  book: CSSProperties;
  isbn: CSSProperties;
} = {
  buttons: {
    position: 'absolute',
    right: '5px',
    bottom: '10px',
  },
  book: {
    position: 'relative',
    width: '200px',
    height: '250px',
    border: '1px solid #666',
    padding: '10px',
    boxShadow: '6px 6px 2px 0 rgba(0, 0, 0, 0.7)',
    backgroundColor: '#eee',
    color: '#333',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
  },
  isbn: {
    fontSize: '12px',
    color: '#666',
  },
};

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
}

export default function BookCard({ book, onEdit }: BookCardProps) {
  const { deleteBookFromCache, db, editMode } = useAuth();

  function handleEdit() {
    onEdit(book);
  }

  function handleDelete(id: number) {
    db?.table('books').delete(id);
    deleteBookFromCache(id);
  }

  return (
    <>
      <li key={book.id} style={style.book}>
        <div style={style.buttons}>
          {editMode && (
            <>
              <button className='btn_edit' onClick={handleEdit}>
                Edit
              </button>
              <button className='btn_delete' onClick={() => handleDelete(book.id)}>
                Delete
              </button>
            </>
          )}
        </div>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p style={style.isbn}>ISBN: {book.isbn}</p>
        <p>Pages: {book.pages}</p>
        <p>Rating: {book.rating}</p>
      </li>
    </>
  );
}
