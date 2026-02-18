import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock AuthProvider
jest.unstable_mockModule('../providers/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: any) => React.createElement('div', null, children),
}));

// Mock AppLayout
jest.unstable_mockModule('@/components/layout/AppLayout', () => ({
  AppLayout: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'app-layout' }, children),
}));

// Mock all lazy-loaded pages
jest.unstable_mockModule('@/features/dashboard/DashboardPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'dashboard-page' }, 'Dashboard'),
}));

jest.unstable_mockModule('@/features/document-tracker/pages/DocumentTrackerPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'doc-tracker-page' }, 'Document Tracker'),
}));

jest.unstable_mockModule('@/features/document-tracker/pages/DocumentDetailsPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'doc-details-page' }, 'Document Details'),
}));

jest.unstable_mockModule('@/features/capital-call/pages/CapitalCallPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'capital-call-page' }, 'Capital Call'),
}));

jest.unstable_mockModule('@/features/capital-call/pages/CapitalCallDetailsPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'capital-call-details-page' }, 'Capital Call Details'),
}));

jest.unstable_mockModule('@/features/accounting-cash/AccountingCashLanding', () => ({
  default: () => React.createElement('div', { 'data-testid': 'accounting-cash-landing' }, 'Accounting Cash'),
}));

jest.unstable_mockModule('@/features/accounting-cash/private-equity/PrivateEquityLanding', () => ({
  default: () => React.createElement('div', { 'data-testid': 'private-equity-landing' }, 'Private Equity'),
}));

jest.unstable_mockModule('@/features/alternative-data/pages/AlternativeDataPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'alt-data-page' }, 'Alternative Data'),
}));

jest.unstable_mockModule('@/features/auth/LoginPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'login-page' }, 'Login Page'),
}));

const { Router } = await import('../Router');

describe('Router', () => {
  it('renders without crashing', async () => {
    const { container } = render(<Router />);
    expect(container).toBeDefined();
  });

  it('renders the login page at /login route', async () => {
    // We need to set window.location to /login before rendering
    // BrowserRouter uses window.location, so we use a workaround:
    // Re-import with MemoryRouter approach by testing the route config indirectly
    window.history.pushState({}, '', '/login');
    render(<Router />);

    // Wait for Suspense lazy loading to resolve
    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
    expect(loginPage.textContent).toBe('Login Page');
  });

  it('redirects root path to /dashboard (then to /login since unauthenticated)', async () => {
    window.history.pushState({}, '', '/');
    render(<Router />);

    // Since user is not authenticated, ProtectedRoute redirects to /login
    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });
});
