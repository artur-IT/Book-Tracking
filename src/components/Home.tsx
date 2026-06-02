import MainContent from './MainContent';
import BookList from './BookList';
import type { CSSProperties } from 'react';
import BookForm from './BookForm';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import Login from './Login';

const style: {
  hero: CSSProperties;
  footer: CSSProperties;
} = {
  hero: {
    margin: '0 auto',
    padding: '20px 30px',
    backgroundColor: '#ddd',
    borderRadius: '15px',
  },
  footer: {
    padding: '20px 0px',
    fontSize: '12px',
  },
};

export default function Home() {
  const { isLoggedIn, handleLogout } = useAuth();
  const [showBookForm, setShowBookForm] = useState(false);
  const [loginPage, setLoginPage] = useState(false);

  return (
    <>
      <main id='center'>
        <nav>
          {isLoggedIn ? (
            <>
              <span>My Books </span>
              <button onClick={() => setShowBookForm(!showBookForm)}>
                Add
              </button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={() => setLoginPage(!loginPage)}>Login</button>
          )}
          {loginPage && <Login setLoginPage={setLoginPage} />}
          {showBookForm && <BookForm setShowBookForm={setShowBookForm} />}
        </nav>

        {/* Hero */}
        <div style={style.hero}>
          <h1>Book Tracking</h1>
          <p>Check how many books you have read</p>
        </div>

        {/* MainContent */}
        <MainContent>
          {isLoggedIn ? (
            <BookList />
          ) : (
            <p>Please Login to see the list of books</p>
          )}
        </MainContent>
      </main>

      <footer style={style.footer}>
        <p>Copyright 2026 - Book Tracking</p>
      </footer>
    </>
  );
}
