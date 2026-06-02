import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const style: {
  container: CSSProperties;
  modalContent: CSSProperties;
  error: CSSProperties;
} = {
  container: {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'yellow',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '300px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
};

export default function Login({ setLoginPage }) {
  const { handleLogin } = useAuth();
  const [error, setError] = useState({ login: '', password: '' });

  const getLoginData = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;
    if (!validateLoginData(login, password)) {
      return;
    }
    handleLogin(login, password);

    return setLoginPage(false);
  };

  const validateLoginData = (login: string, password: string) => {
    const newError = { login: '', password: '' };
    if (login === '') {
      newError.login = 'Login is required';
    }
    if (password === '') {
      newError.password = 'Password is required';
    }

    if (newError.login !== '' || newError.password !== '') {
      setError(newError);
      return false;
    }
    return true;
  };

  return (
    <section style={style.container}>
      <form style={style.modalContent} onSubmit={getLoginData}>
        <div>
          <label htmlFor='login'>Login </label>
          <input type='text' name='login' />
        </div>
        <div>
          <label htmlFor='password'>Password </label>
          <input type='password' name='password' />
        </div>
        {error.login && <p style={style.error}>{error.login}</p>}{' '}
        {error.password && <p style={style.error}>{error.password}</p>}
        <button type='submit' value='confirm'>
          Login
        </button>
        <button type='button' onClick={() => setLoginPage(false)}>
          Cancel
        </button>
      </form>
    </section>
  );
}
