import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();

jest.unstable_mockModule('react-router-dom', () => ({
  useParams: () => ({ genId: 'GEN001' }),
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('../../hooks/useDocumentSearch', () => ({
  useDocumentDetails: () => ({
    data: {
      genId: 'GEN001',
      documentType: 'TYPE1',
      receivedAt: '2024-01-15T10:00:00Z',
      subDocuments: [
        {
          id: 1,
          subId: 'SUB001',
          status: 'COMPLETED',
          severity: 'SUCCESS',
          statusMessage: 'Processed successfully',
          processedAt: '2024-01-15T11:00:00Z',
        },
      ],
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

const { default: DocumentDetailsPage } = await import('../DocumentDetailsPage');

describe('DocumentDetailsPage', () => {
  it('renders document details', () => {
    render(<DocumentDetailsPage />);
    expect(screen.getByText('Document Details')).toBeInTheDocument();
    expect(screen.getByText('GEN001')).toBeInTheDocument();
  });

  it('renders sub documents section', () => {
    render(<DocumentDetailsPage />);
    expect(screen.getByText('Sub Documents')).toBeInTheDocument();
    expect(screen.getByText('SUB001')).toBeInTheDocument();
  });

  it('shows back navigation link', () => {
    render(<DocumentDetailsPage />);
    expect(screen.getByText('Back to Documents')).toBeInTheDocument();
  });
});
