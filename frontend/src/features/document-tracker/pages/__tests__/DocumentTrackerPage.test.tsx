import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.unstable_mockModule('@/app/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', username: 'admin', email: 'a@b.com', permissions: [], roles: [] },
    isAuthenticated: true,
  }),
}));

jest.unstable_mockModule('../../hooks/useDocumentSearch', () => ({
  useDocumentSearch: () => ({
    data: null,
    isLoading: false,
    error: null,
    searchParams: { filters: {}, pagination: { page: 0, size: 25 }, sort: [] },
    handleSearch: jest.fn(),
    handlePageChange: jest.fn(),
    handleSort: jest.fn(),
    handleReset: jest.fn(),
    refetch: jest.fn(),
  }),
  useDocumentExport: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.unstable_mockModule('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const { default: DocumentTrackerPage } = await import('../DocumentTrackerPage');

describe('DocumentTrackerPage', () => {
  it('renders page title', () => {
    render(<DocumentTrackerPage />);
    expect(screen.getByText('Document Tracker')).toBeInTheDocument();
  });

  it('shows logged in user', () => {
    render(<DocumentTrackerPage />);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('renders filters and grid sections', () => {
    render(<DocumentTrackerPage />);
    expect(screen.getByText('Search & Filter')).toBeInTheDocument();
    expect(screen.getByText('No documents found')).toBeInTheDocument();
  });
});
