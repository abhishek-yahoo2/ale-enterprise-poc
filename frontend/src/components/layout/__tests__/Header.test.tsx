import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockAuth = {
  user: { id: '1', username: 'TestUser', email: 'test@example.com', permissions: [], roles: [] },
  isAuthenticated: true,
  login: jest.fn(),
  logout: mockLogout,
};

jest.unstable_mockModule('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('@/app/providers/AuthProvider', () => ({
  useAuth: () => mockAuth,
}));

const { Header } = await import('../Header');

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  it('renders the user name', () => {
    const onToggleSidebar = jest.fn();
    render(<Header onToggleSidebar={onToggleSidebar} sidebarOpen={false} />);
    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });

  it('renders "Guest" when no user is provided', () => {
    const originalUser = mockAuth.user;
    mockAuth.user = null as any;

    const onToggleSidebar = jest.fn();
    render(<Header onToggleSidebar={onToggleSidebar} sidebarOpen={false} />);
    expect(screen.getByText('Guest')).toBeInTheDocument();

    mockAuth.user = originalUser;
  });

  it('calls logout and navigates to /login on logout click', async () => {
    const user = userEvent.setup();
    const onToggleSidebar = jest.fn();
    render(<Header onToggleSidebar={onToggleSidebar} sidebarOpen={false} />);

    await user.click(screen.getByTitle('Logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls onToggleSidebar when the menu button is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSidebar = jest.fn();
    render(<Header onToggleSidebar={onToggleSidebar} sidebarOpen={false} />);

    await user.click(screen.getByLabelText('Toggle sidebar'));
    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
