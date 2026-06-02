import type { CSSProperties } from 'react';
import BookSearch from './BookSearch';
import { memo, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/db';

const style: {
  container: CSSProperties;
  list: CSSProperties;
  book: CSSProperties;
  isbn: CSSProperties;
  pagination: CSSProperties;
  pageButton: CSSProperties;
  activePageButton: CSSProperties;
  info: CSSProperties;
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
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  pageButton: {
    padding: '6px 10px',
    border: '1px solid #666',
    background: '#fff',
    cursor: 'pointer',
  },
  activePageButton: {
    padding: '6px 10px',
    border: '1px solid #222',
    background: '#333',
    color: '#fff',
    cursor: 'default',
    fontWeight: 700,
  },
  info: {
    textAlign: 'center',
    marginTop: '12px',
    color: '#333',
  },
};

function BookList() {
  const [searchingWord, setSearchingWord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const booksDixie = useLiveQuery(async () => {
    const all = await db.books.toArray();
    if (!searchingWord) return all;
    return all.filter((book) =>
      book.title.toLowerCase().includes(searchingWord.toLowerCase()),
    );
  }, [searchingWord]);

  const totalBooks = booksDixie?.length ?? '...';
  const totalPages = Math.max(1, Math.ceil(Number(totalBooks) / booksPerPage));
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = booksDixie?.slice(startIndex, endIndex) ?? [];

  // Reset to first page after search phrase changes
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchingWord]);
  // Safety: if data shrinks, keep page in valid range
  useEffect(() => {
    if (currentPage > totalPages) {
      setTimeout(() => {
        setCurrentPage(totalPages);
      }, 0);
    }
  }, [currentPage, totalPages]);

  return (
    <section style={style.container}>
      <h2>Book List</h2>
      <BookSearch setSearchingWord={setSearchingWord} />

      <div style={style.info}>
        <p>Total books: {totalBooks}</p>
      </div>

      <ul style={style.list}>
        {!booksDixie && (
          <li style={{ marginTop: '20px' }}>
            Wait, I'm reading 📖 your books...
          </li>
        )}
        {booksDixie && currentBooks.length === 0 && <li>No books found.</li>}

        {currentBooks.map((book) => (
          <li key={book.id} style={style.book}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p style={style.isbn}>ISBN: {book.isbn}</p>
            <p>Pages: {book.pages}</p>
            <p>Rating: {book.rating}</p>
          </li>
        ))}
      </ul>

      {Number(totalBooks) > 0 && (
        <>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div style={style.pagination}>
            <button
              style={style.pageButton}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              style={style.pageButton}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default memo(BookList);
