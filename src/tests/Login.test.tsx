import { render, screen } from '@testing-library/react';
import Login from '../components/Login';
import AuthProvider from '../hooks/useAuth';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('Login component', () => {
  let setLoginPage: (show: boolean) => void;
  beforeEach(() => {
    setLoginPage = vi.fn();
    render(
      <AuthProvider>
        <Login setLoginPage={setLoginPage} />
      </AuthProvider>,
    );
  });

  it('should display Login button', () => {
    expect(screen.getByRole('button', { name: 'Login' })).toBeDefined();
  });

  it('should call getLoginData(e) when Login button is clicked', async () => {
    const getLoginData = vi.fn();
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(getLoginData);
  });

  it('should call setLoginPage(false) when Cancel button is clicked', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(setLoginPage).toHaveBeenCalledWith(false);
  });
});
