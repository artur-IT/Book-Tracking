import { type CSSProperties } from 'react';
import { useAuth, type Book } from '../hooks/useAuth';

const style: {
  container: CSSProperties;
  modalContent: CSSProperties;
  error: CSSProperties;
  column: CSSProperties;
  description: CSSProperties;
  fields: CSSProperties;
  title: CSSProperties;
} = {
  container: {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 1000,
  },
  modalContent: {
    background: 'yellow',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '350px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    width: '80%',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
  title: {
    width: '100%',
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
};

interface BookFormEditProps {
  book: Book;
  onClose: () => void;
}

export default function BookFormEdit({ book, onClose }: BookFormEditProps) {
  const { db, updateBookInCache } = useAuth();

  async function handleEditBook(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedBook = {
      ...book, // save id and createdAt
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      isbn: Number(formData.get('isbn')),
      pages: Number(formData.get('pages')),
      rating: Number(formData.get('rating')),
    };
    try {
      await db?.table('books').put(updatedBook);
      updateBookInCache(updatedBook);
    } catch (error) {
      console.error(error);
    }

    onClose();
  }
  return (
    <section style={style.container}>
      <form style={style.modalContent} onSubmit={handleEditBook}>
        <h3 style={style.title}>Edit Book</h3>
        <div style={style.description}>
          <label htmlFor='title'>Title </label>
          <label htmlFor='author'>Author </label>
          <label htmlFor='isbn'>ISBN </label>
          <label htmlFor='pages'>Pages </label>
          <label htmlFor='rating'>Rating </label>
        </div>
        <div style={style.fields}>
          <input id='title' type='text' name='title' maxLength='70' placeholder='max. 70 characters' required defaultValue={book.title} />
          <input id='author' type='text' name='author' maxLength='30' placeholder='max. 30 characters' defaultValue={book.author} required />
          <input id='isbn' type='number' name='isbn' required pattern='[0-9]{13}' min='1' max='9999999999999' placeholder='max. 13 digits' defaultValue={book.isbn} />
          <input id='pages' type='number' name='pages' min='1' max='3000' placeholder='max. 3000 pages' defaultValue={book.pages} />
          <input id='rating' type='number' name='rating' min='1' max='5' placeholder='1 - 5' defaultValue={book.rating} />
        </div>
        <div>
          <button type='submit'>Save Book</button>
          <button type='button' onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
