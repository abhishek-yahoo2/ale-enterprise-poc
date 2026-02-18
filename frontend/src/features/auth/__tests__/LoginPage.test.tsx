import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('@/app/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: mockLogin,
    logout: jest.fn(),
  }),
}));

jest.unstable_mockModule('lucide-react', () => ({
  Lock: () => React.createElement('span', null, 'LockIcon'),
}));

const { default: LoginPage } = await import('../LoginPage');

describe('LoginPage', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('renders login form elements', () => {
    render(<LoginPage />);
    expect(screen.getByText('ALE')).toBeInTheDocument();
    expect(screen.getByText('Application Lifecycle Engine')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders SSO buttons', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument();
  });

  it('handles SSO login with Google', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByText('Sign in with Google'));
    expect(mockLogin).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'google_user' }),
      'mock-jwt-token'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('handles SSO login with Microsoft', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByText('Sign in with Microsoft'));
    expect(mockLogin).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'microsoft_user' }),
      'mock-jwt-token'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('submits form with credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.type(screen.getByPlaceholderText('Enter your username'), 'demo');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'pass');
    await user.click(screen.getByText('Sign In'));
    expect(mockLogin).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'demo' }),
      'mock-jwt-token'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows error when submitting without credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.click(screen.getByText('Sign In'));
    expect(screen.getByText('Please enter username and password')).toBeInTheDocument();
  });

  it('shows demo credentials hint', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Demo credentials/)).toBeInTheDocument();
  });
});
