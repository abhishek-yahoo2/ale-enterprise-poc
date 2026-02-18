import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock formatters
jest.unstable_mockModule('@/lib/utils/formatters', () => ({
  formatDateTime: (val: string) => val,
}));

const { AlternativeDataGrid } = await import('../AlternativeDataGrid');

const mockData = {
  data: [
    {
      id: '1',
      clientName: 'Acme Corp',
      accountNumber: 'ACC-001',
      fundFamily: 'Growth Fund',
      assetDescription: 'Equity',
      status: 'DRAFT',
    },
    {
      id: '2',
      clientName: 'Beta Inc',
      accountNumber: 'ACC-002',
      fundFamily: 'Value Fund',
      assetDescription: 'Bond',
      status: 'VALIDATED',
    },
  ],
  pagination: {
    currentPage: 0,
    totalPages: 2,
    totalElements: 10,
  },
};

describe('AlternativeDataGrid', () => {
  const mockOnRowClick = jest.fn();
  const mockOnSort = jest.fn();
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = render(
      <MemoryRouter>
        <AlternativeDataGrid
          data={null}
          isLoading={true}
          columnPreferences={null}
          onRowClick={mockOnRowClick}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <MemoryRouter>
        <AlternativeDataGrid
          data={null}
          isLoading={false}
          columnPreferences={null}
          onRowClick={mockOnRowClick}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('No records found. Try adjusting your filters.')).toBeInTheDocument();
  });

  it('renders data rows and total count', () => {
    render(
      <MemoryRouter>
        <AlternativeDataGrid
          data={mockData}
          isLoading={false}
          columnPreferences={null}
          onRowClick={mockOnRowClick}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Records (10)')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
  });

  it('renders pagination controls when multiple pages exist', () => {
    render(
      <MemoryRouter>
        <AlternativeDataGrid
          data={mockData}
          isLoading={false}
          columnPreferences={null}
          onRowClick={mockOnRowClick}
          onSort={mockOnSort}
          onPageChange={mockOnPageChange}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });
});
