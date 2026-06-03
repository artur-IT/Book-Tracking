import { render, screen } from '@testing-library/react';
import Login from '../components/Login';
import AuthProvider from '../hooks/useAuth';

describe('Login', () => {
  it('should render login page', () => {
    render(
      <AuthProvider>
        <Login setLoginPage={() => {}} />
      </AuthProvider>,
    );

    expect(screen.getByRole('button', { name: 'Login' })).toBeDefined();
  });
});
