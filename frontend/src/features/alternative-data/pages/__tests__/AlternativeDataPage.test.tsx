import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the hooks used by AlternativeDataPage
jest.unstable_mockModule('../../hooks/useAlternativeDataSearch', () => ({
  useAlternativeDataSearch: () => ({
    data: null,
    isLoading: false,
    error: null,
    searchParams: {},
    handleSearch: jest.fn(),
    handlePageChange: jest.fn(),
    handleSort: jest.fn(),
    handleReset: jest.fn(),
  }),
  useColumnPreferences: () => ({
    data: null,
  }),
}));

// Mock the sub-components
jest.unstable_mockModule('../../components/AlternativeDataFilters', () => ({
  AlternativeDataFilters: (props: any) =>
    React.createElement('div', { 'data-testid': 'alt-data-filters' }, 'Filters'),
}));

jest.unstable_mockModule('../../components/AlternativeDataGrid', () => ({
  AlternativeDataGrid: (props: any) =>
    React.createElement('div', { 'data-testid': 'alt-data-grid' }, 'Grid'),
}));

const { default: AlternativeDataPage } = await import('../AlternativeDataPage');

describe('AlternativeDataPage', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <AlternativeDataPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('displays the page title', () => {
    render(
      <MemoryRouter>
        <AlternativeDataPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Alternative Data Management')).toBeInTheDocument();
  });

  it('renders filters and grid sub-components', () => {
    render(
      <MemoryRouter>
        <AlternativeDataPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('alt-data-filters')).toBeInTheDocument();
    expect(screen.getByTestId('alt-data-grid')).toBeInTheDocument();
  });
});
