import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
const mockRefetch = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  useParams: () => ({ genId: 'GEN001' }),
  useNavigate: () => mockNavigate,
}));

let mockDocDetailsReturn: any;

jest.unstable_mockModule('../../hooks/useDocumentSearch', () => ({
  useDocumentDetails: () => mockDocDetailsReturn,
}));

jest.unstable_mockModule('lucide-react', () => ({
  ChevronLeft: () => React.createElement('span', null, '<'),
  AlertCircle: () => React.createElement('span', null, '!'),
  CheckCircle: () => React.createElement('span', null, 'OK'),
  AlertTriangle: () => React.createElement('span', null, 'Warn'),
  Info: () => React.createElement('span', null, 'i'),
}));

const { default: DocumentDetailsPage } = await import('../DocumentDetailsPage');

describe('DocumentDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDocDetailsReturn = {
      data: {
        genId: 'GEN001', documentType: 'TYPE1', receivedAt: '2024-01-15T10:00:00Z',
        subDocuments: [
          { id: 1, subId: 'SUB001', status: 'COMPLETED', severity: 'SUCCESS', statusMessage: 'Processed', processedAt: '2024-01-15T11:00:00Z' },
          { id: 2, subId: 'SUB002', status: 'FAILED', severity: 'ERROR', statusMessage: 'Failed', processedAt: '2024-01-15T12:00:00Z' },
          { id: 3, subId: 'SUB003', status: 'WARNING', severity: 'WARNING', statusMessage: 'Warning msg', processedAt: '2024-01-15T12:00:00Z' },
          { id: 4, subId: 'SUB004', status: 'INFO', severity: 'INFO', statusMessage: 'Info msg', processedAt: '2024-01-15T12:00:00Z' },
        ],
      },
      isLoading: false, error: null, refetch: mockRefetch,
    };
  });

  it('renders document details', () => {
    render(<DocumentDetailsPage />);
    expect(screen.getByText('Document Details')).toBeInTheDocument();
    expect(screen.getByText('GEN001')).toBeInTheDocument();
    expect(screen.getByText('TYPE1')).toBeInTheDocument();
  });

  it('renders sub documents', () => {
    render(<DocumentDetailsPage />);
    expect(screen.getByText('Sub Documents')).toBeInTheDocument();
    expect(screen.getByText('SUB001')).toBeInTheDocument();
    expect(screen.getByText('SUB002')).toBeInTheDocument();
  });

  it('renders all severity types', () => {
    render(<DocumentDetailsPage />);
    expect(screen.getByText('SUB001')).toBeInTheDocument();
    expect(screen.getByText('SUB002')).toBeInTheDocument();
    expect(screen.getByText('SUB003')).toBeInTheDocument();
    expect(screen.getByText('SUB004')).toBeInTheDocument();
  });

  it('shows back navigation link and navigates', async () => {
    const user = userEvent.setup();
    render(<DocumentDetailsPage />);
    const backLink = screen.getByText('Back to Documents');
    expect(backLink).toBeInTheDocument();
    await user.click(backLink);
    expect(mockNavigate).toHaveBeenCalledWith('/document-tracker');
  });

  it('shows loading state', () => {
    mockDocDetailsReturn = { data: null, isLoading: true, error: null, refetch: mockRefetch };
    render(<DocumentDetailsPage />);
    expect(screen.getByText('Loading document details...')).toBeInTheDocument();
  });

  it('shows error state with retry', () => {
    mockDocDetailsReturn = { data: null, isLoading: false, error: new Error('Failed'), refetch: mockRefetch };
    render(<DocumentDetailsPage />);
    expect(screen.getByText('Failed to Load Document')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('calls refetch on Retry click', async () => {
    mockDocDetailsReturn = { data: null, isLoading: false, error: new Error('Failed'), refetch: mockRefetch };
    const user = userEvent.setup();
    render(<DocumentDetailsPage />);
    await user.click(screen.getByText('Retry'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('shows no sub documents message when empty', () => {
    mockDocDetailsReturn.data.subDocuments = [];
    render(<DocumentDetailsPage />);
    expect(screen.getByText('No sub documents found')).toBeInTheDocument();
  });

  it('shows count of sub documents', () => {
    render(<DocumentDetailsPage />);
    expect(screen.getByText('(4 items)')).toBeInTheDocument();
  });
});
