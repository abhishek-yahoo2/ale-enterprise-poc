import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthProvider';

const TestConsumer = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="user">{user?.username || 'none'}</span>
      <button onClick={() => login({ id: '1', username: 'admin', email: 'a@b.com', permissions: [], roles: [] }, 'token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated', () => {
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    expect(screen.getByTestId('auth').textContent).toBe('no');
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  it('logs in and updates state', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('auth').textContent).toBe('yes');
    expect(screen.getByTestId('user').textContent).toBe('admin');
  });

  it('persists user to localStorage on login', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    await user.click(screen.getByText('Login'));
    expect(localStorage.getItem('user')).toContain('admin');
    expect(localStorage.getItem('authToken')).toBe('token');
  });

  it('logs out and clears state', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    await user.click(screen.getByText('Login'));
    await user.click(screen.getByText('Logout'));
    expect(screen.getByTestId('auth').textContent).toBe('no');
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('restores user from localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', username: 'stored' }));
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    expect(screen.getByTestId('auth').textContent).toBe('yes');
    expect(screen.getByTestId('user').textContent).toBe('stored');
  });

  it('throws when useAuth is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within an AuthProvider');
    spy.mockRestore();
  });
});
