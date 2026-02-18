import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
const mockRefetch = jest.fn();
const mockExportData = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('@/app/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1', username: 'admin', email: 'a@b.com', permissions: [], roles: [] },
    isAuthenticated: true,
  }),
}));

let mockError: Error | null = null;

jest.unstable_mockModule('../../hooks/useDocumentSearch', () => ({
  useDocumentSearch: () => ({
    data: null, isLoading: false, error: mockError,
    searchParams: { filters: {}, pagination: { page: 0, size: 25 }, sort: [] },
    handleSearch: jest.fn(), handlePageChange: jest.fn(), handleSort: jest.fn(),
    handleReset: jest.fn(), refetch: mockRefetch,
  }),
  useDocumentExport: () => ({ mutate: mockExportData, isPending: false }),
}));

jest.unstable_mockModule('../../components/DocumentTrackerFilters', () => ({
  DocumentTrackerFilters: (props: any) => React.createElement('div', { 'data-testid': 'filters' }, 'Filters'),
}));

jest.unstable_mockModule('../../components/DocumentTrackerGrid', () => ({
  DocumentTrackerGrid: (props: any) =>
    React.createElement('div', { 'data-testid': 'grid',
      onClick: () => props.onRowClick({ genId: 'GEN001' }),
    }, React.createElement('button', { onClick: props.onExport }, 'Export')),
}));

jest.unstable_mockModule('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const { default: DocumentTrackerPage } = await import('../DocumentTrackerPage');

describe('DocumentTrackerPage', () => {
  beforeEach(() => { jest.clearAllMocks(); mockError = null; });

  it('renders page title and user info', () => {
    render(<DocumentTrackerPage />);
    expect(screen.getByText('Document Tracker')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('renders filters and grid', () => {
    render(<DocumentTrackerPage />);
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('shows error state with Try Again button', () => {
    mockError = new Error('Network error');
    render(<DocumentTrackerPage />);
    expect(screen.getByText(/Failed to load documents/)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls refetch when Try Again is clicked', async () => {
    mockError = new Error('Network error');
    const user = userEvent.setup();
    render(<DocumentTrackerPage />);
    await user.click(screen.getByText('Try Again'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('navigates on row click', async () => {
    const user = userEvent.setup();
    render(<DocumentTrackerPage />);
    await user.click(screen.getByTestId('grid'));
    expect(mockNavigate).toHaveBeenCalledWith('/document-tracker/GEN001');
  });

  it('calls export on export click', async () => {
    const user = userEvent.setup();
    render(<DocumentTrackerPage />);
    await user.click(screen.getByText('Export'));
    expect(mockExportData).toHaveBeenCalled();
  });
});
