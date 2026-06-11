import type { CSSProperties } from 'react';
import BookSearch from './BookSearch';
import { useEffect, useMemo, useState } from 'react';
import { useAuth, type Book } from '../hooks/useAuth';
import BookCard from './BookCard';
import BookFormEdit from './BookFormEdit';

const style: {
  container: CSSProperties;
  list: CSSProperties;
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
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  pageButton: {
    margin: 0,
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
    fontSize: '16px',
  },
};

function BookList() {
  const [searchingWord, setSearchingWord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const { importProgress, booksCache } = useAuth();
  const booksPerPage = 8;

  const filteredBooks = useMemo(() => {
    const query = searchingWord.trim().toLowerCase();
    if (!query) return booksCache;
    return booksCache.filter((book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
  }, [booksCache, searchingWord]);

  const totalBooks = filteredBooks?.length ?? '...';
  const totalPages = Math.max(1, Math.ceil(Number(totalBooks) / booksPerPage));
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks?.slice(startIndex, endIndex) ?? [];

  const memoBookSearch = useMemo(() => {
    return <BookSearch setSearchingWord={setSearchingWord} />;
  }, [setSearchingWord]);

  const infoMessage = () => {
    if (importProgress?.isImporting) {
      const imported = importProgress.imported.toLocaleString('pl-PL');
      const total = importProgress.total.toLocaleString('pl-PL');
      return `Loading ${imported} of ${total} books`;
    }

    const formattedTotal = totalBooks.toLocaleString('pl-PL');

    if (searchingWord) return `Found ${formattedTotal} books`;
    if (Number(totalBooks) > 0) return `You have ${formattedTotal} books`;

    return 'Wait... you have probably very big library 🏛️';
  };

  // Reset to first page after search phrase changes
  useEffect(() => {
    setTimeout(() => setCurrentPage(1), 0);
  }, [searchingWord]);

  // Safety: if data shrinks, keep page in valid range
  useEffect(() => {
    if (currentPage > totalPages) setTimeout(() => setCurrentPage(totalPages), 0);
  }, [currentPage, totalPages]);

  return (
    <section style={style.container}>
      <h2>Book List</h2>
      {memoBookSearch}

      <div style={style.info}>
        <p>{infoMessage()}</p>
      </div>

      {editingBook && <BookFormEdit book={editingBook} onClose={() => setEditingBook(null)} />}

      <ul style={style.list}>
        {currentBooks.map((book) => (
          <BookCard key={book.id} book={book} onEdit={setEditingBook} />
        ))}
      </ul>

      {Number(totalBooks) > 0 && (
        <>
          <p>
            Page {currentPage} of {totalPages.toLocaleString('pl-PL')}
          </p>
          <div style={style.pagination}>
            <button style={{ ...style.pageButton, visibility: currentPage === 1 ? 'hidden' : 'visible' }} onClick={() => setCurrentPage(1)}>
              First
            </button>
            <button style={style.pageButton} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
              Prev
            </button>
            <button style={style.pageButton} onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
              Next
            </button>
            <button style={{ ...style.pageButton, visibility: currentPage === totalPages ? 'hidden' : 'visible' }} onClick={() => setCurrentPage(totalPages)}>
              Last
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default BookList;
