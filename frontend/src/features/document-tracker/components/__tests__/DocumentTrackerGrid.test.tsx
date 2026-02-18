import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { DocumentTrackerGrid } = await import('../DocumentTrackerGrid');

const mockData = {
  data: [
    {
      id: 1,
      genId: 'GEN001',
      documentDate: '2024-01-15T10:00:00Z',
      clientName: 'Client A',
      accountNumber: 'ACC001',
      securityNumber: 'SEC001',
      documentName: 'Doc1',
      status: 'COMPLETED',
      currentLocation: 'NYC',
      businessUnit: 'BU1',
      link: 'http://example.com',
    },
  ],
  pagination: {
    currentPage: 0,
    pageSize: 25,
    totalElements: 1,
    totalPages: 1,
  },
};

describe('DocumentTrackerGrid', () => {
  const defaultProps = {
    data: mockData,
    isLoading: false,
    onRowClick: jest.fn(),
    onSort: jest.fn(),
    onPageChange: jest.fn(),
    onExport: jest.fn(),
  };

  it('shows loading state', () => {
    render(<DocumentTrackerGrid {...(defaultProps as any)} isLoading={true} data={null} />);
    expect(screen.getByText('Loading documents...')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DocumentTrackerGrid {...(defaultProps as any)} data={null} />);
    expect(screen.getByText('No documents found')).toBeInTheDocument();
  });

  it('renders data table with documents', () => {
    render(<DocumentTrackerGrid {...(defaultProps as any)} />);
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('GEN001')).toBeInTheDocument();
    expect(screen.getByText('Client A')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup();
    render(<DocumentTrackerGrid {...(defaultProps as any)} />);
    await user.click(screen.getByText('GEN001'));
    expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockData.data[0]);
  });

  it('calls onExport when Export clicked', async () => {
    const user = userEvent.setup();
    render(<DocumentTrackerGrid {...(defaultProps as any)} />);
    await user.click(screen.getByText('Export'));
    expect(defaultProps.onExport).toHaveBeenCalled();
  });
});
