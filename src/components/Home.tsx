import MainContent from './MainContent';
import BookList from './BookList';
import type { CSSProperties } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import Login from './Login';
import BookForm from './BookForm';

const style: {
  nav: CSSProperties;
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
  nav: {
    margin: '0',
    padding: '10px 15px',
  },
};

export default function Home() {
  const { isLoggedIn, handleLogout, showBookForm, setShowBookForm, setEditMode, editMode } = useAuth();
  const [loginPage, setLoginPage] = useState(false);

  const handleAdd = () => setShowBookForm(true);

  const menuAfterLogin = (
    <>
      <span style={{ marginRight: '10px' }}>My Books </span>
      <button style={{ visibility: editMode ? 'hidden' : 'visible' }} onClick={handleAdd} disabled={editMode}>
        Add
      </button>
      <button style={{ backgroundColor: editMode ? 'yellow' : '' }} onClick={() => setEditMode(!editMode)}>
        Edit
      </button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );

  return (
    <>
      <main id='center'>
        <nav style={style.nav}>
          {isLoggedIn ? menuAfterLogin : <button onClick={() => setLoginPage(!loginPage)}>Login</button>}
          {loginPage && <Login setLoginPage={setLoginPage} />}
          {showBookForm && !editMode ? <BookForm /> : null}
        </nav>

        {/* Hero */}
        <header style={style.hero}>
          <h1>Book Tracking</h1>
          <p>Check how many books you have read</p>
        </header>

        {/* MainContent */}
        <MainContent>{isLoggedIn ? <BookList /> : <p>Please Login to see the list of books</p>}</MainContent>
      </main>

      <footer style={style.footer}>
        <p>Copyright 2026 - Book Tracking</p>
      </footer>
    </>
  );
}
