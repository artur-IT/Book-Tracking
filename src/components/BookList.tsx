import type { CSSProperties } from 'react';
import BookSearch from './BookSearch';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/db';

const style: {
  container: CSSProperties;
  list: CSSProperties;
  book: CSSProperties;
  isbn: CSSProperties;
} = {
  container: {
    margin: '0 auto',
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    listStyle: 'none',
    textAlign: 'left',
    padding: '0',
  },
  book: {
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

export default function BookList() {
  const [searchingWord, setSearchingWord] = useState('');
  const booksDixie = useLiveQuery(async () => {
    const all = await db.books.toArray();
    if (!searchingWord) return all;
    return all.filter((book) =>
      book.title.toLowerCase().includes(searchingWord.toLowerCase()),
    );
  }, [searchingWord]);

  return (
    <section style={style.container}>
      <h2>Book List</h2>
      <BookSearch setSearchingWord={setSearchingWord} />
      <ul style={style.list}>
        {/* {books.length > 0 && <li>No books in database</li>} */}
        {booksDixie?.map((book) => (
          <li key={book.id} style={style.book}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p style={style.isbn}>ISBN: {book.isbn}</p>
            <p>Pages: {book.pages}</p>
            <p>Rating: {book.rating}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
