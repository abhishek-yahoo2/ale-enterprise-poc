import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock react-hook-form
jest.unstable_mockModule('react-hook-form', () => ({
  useForm: () => ({
    register: (name: string) => ({ name }),
    handleSubmit: (fn: any) => (e: any) => {
      e?.preventDefault?.();
      fn({
        clientName: '',
        accountNumber: '',
        fundFamily: '',
        status: '',
        fromDate: '',
        toDate: '',
      });
    },
    reset: jest.fn(),
  }),
}));

const { AlternativeDataFilters } = await import('../AlternativeDataFilters');

describe('AlternativeDataFilters', () => {
  const mockOnSearch = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <AlternativeDataFilters onSearch={mockOnSearch} onReset={mockOnReset} />
    );
    expect(container).toBeDefined();
  });

  it('renders all filter labels', () => {
    render(
      <AlternativeDataFilters onSearch={mockOnSearch} onReset={mockOnReset} />
    );
    expect(screen.getByText('Client Name')).toBeInTheDocument();
    expect(screen.getByText('Account Number')).toBeInTheDocument();
    expect(screen.getByText('Fund Family')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('From Date')).toBeInTheDocument();
    expect(screen.getByText('To Date')).toBeInTheDocument();
  });

  it('renders Search and Reset buttons', () => {
    render(
      <AlternativeDataFilters onSearch={mockOnSearch} onReset={mockOnReset} />
    );
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('calls onReset when Reset button is clicked', () => {
    render(
      <AlternativeDataFilters onSearch={mockOnSearch} onReset={mockOnReset} />
    );
    fireEvent.click(screen.getByText('Reset'));
    expect(mockOnReset).toHaveBeenCalled();
  });
});
