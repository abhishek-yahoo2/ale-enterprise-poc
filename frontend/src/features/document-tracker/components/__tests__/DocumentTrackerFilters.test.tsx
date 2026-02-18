import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.unstable_mockModule('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const { DocumentTrackerFilters } = await import('../DocumentTrackerFilters');

describe('DocumentTrackerFilters', () => {
  const mockOnSearch = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search form with fields', () => {
    render(<DocumentTrackerFilters onSearch={mockOnSearch as any} onReset={mockOnReset as any} />);
    expect(screen.getByText('Search & Filter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('GEN12345678')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('disables inputs when loading', () => {
    render(<DocumentTrackerFilters onSearch={mockOnSearch as any} onReset={mockOnReset as any} isLoading={true} />);
    expect(screen.getByPlaceholderText('GEN12345678')).toBeDisabled();
  });

  it('calls onReset when Reset is clicked', async () => {
    const user = userEvent.setup();
    render(<DocumentTrackerFilters onSearch={mockOnSearch as any} onReset={mockOnReset as any} />);
    await user.click(screen.getByText('Reset'));
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('shows Advanced button', () => {
    render(<DocumentTrackerFilters onSearch={mockOnSearch as any} onReset={mockOnReset as any} />);
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });
});
