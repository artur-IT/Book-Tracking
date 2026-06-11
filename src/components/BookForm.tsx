import type { CSSProperties } from 'react';
import { useAuth } from '../hooks/useAuth';

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

export default function BookForm() {
  const { db, addBookToCache, setShowBookForm } = useAuth();

  async function handleAddBook(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const id = Date.now();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const isbn = Number(formData.get('isbn')) as number;
    const pages = Number(formData.get('pages')) as number;
    const rating = Number(formData.get('rating')) as number;

    const newBook = {
      id,
      title,
      author,
      isbn,
      pages,
      rating,
      createdAt: new Date().toISOString(),
    };

    try {
      await db?.table('books').add(newBook);
      addBookToCache(newBook);
    } catch (error) {
      console.error(error);
    }

    setShowBookForm(false);
  }
  return (
    <section style={style.container}>
      <form style={style.modalContent} onSubmit={handleAddBook}>
        <h3 style={style.title}>New Book</h3>
        <div style={style.description}>
          <label htmlFor='title'>Title </label>
          <label htmlFor='author'>Author </label>
          <label htmlFor='isbn'>ISBN </label>
          <label htmlFor='pages'>Pages </label>
          <label htmlFor='rating'>Rating </label>
        </div>
        <div style={style.fields}>
          <input id='title' type='text' name='title' maxLength='70' placeholder='max. 70 characters' required />
          <input id='author' type='text' name='author' maxLength='30' placeholder='max. 30 characters' required />
          <input id='isbn' type='number' name='isbn' required pattern='[0-9]{13}' min='1' max='9999999999999' placeholder='max. 13 digits' />
          <input id='pages' type='number' name='pages' min='1' max='3000' placeholder='max. 3000 pages' />
          <input id='rating' type='number' name='rating' min='1' max='5' placeholder='1 - 5' />
        </div>
        <div>
          <button type='submit'>Add Book</button>
          <button type='button' onClick={() => setShowBookForm(false)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
