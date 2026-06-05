import { render, screen } from '@testing-library/react';
import Login from '../components/Login';
import AuthProvider from '../hooks/useAuth';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('Login component', () => {
  it('show Login button', () => {
    render(
      <AuthProvider>
        <Login setLoginPage={() => {}} />
      </AuthProvider>,
    );
    expect(screen.getByRole('button', { name: 'Login' })).toBeDefined();
  });

  it('button Login should call getLoginData(e)', async () => {
    const getLoginData = vi.fn();
    render(
      <AuthProvider>
        <Login setLoginPage={() => {}} />
      </AuthProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(getLoginData);
  });

  it('button Cancel should call setLoginPage(false)', async () => {
    const setLoginPage = vi.fn();
    render(
      <AuthProvider>
        <Login setLoginPage={setLoginPage} />
      </AuthProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(setLoginPage).toHaveBeenCalledWith(false);
  });
});
