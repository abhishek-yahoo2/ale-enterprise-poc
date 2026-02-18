import { jest } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.unstable_mockModule('@/app/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', username: 'testuser', email: 'test@test.com', permissions: [], roles: [] },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

const { default: DashboardPage } = await import('../DashboardPage');

describe('DashboardPage', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('displays welcome message', () => {
    const { getByText } = render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(getByText('Welcome to ALE!')).toBeInTheDocument();
  });

  it('renders module cards', () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(getAllByText('Document Tracker').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Accounting & Cash').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Alternative Data').length).toBeGreaterThanOrEqual(1);
  });
});
