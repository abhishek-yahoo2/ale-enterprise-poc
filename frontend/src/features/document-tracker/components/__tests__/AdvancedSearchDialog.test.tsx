import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { AdvancedSearchDialog } = await import('../AdvancedSearchDialog');

describe('AdvancedSearchDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not open', () => {
    const { container } = render(
      <AdvancedSearchDialog {...(defaultProps as any)} open={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when open', () => {
    render(<AdvancedSearchDialog {...(defaultProps as any)} />);
    expect(screen.getByText('Advanced Search')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<AdvancedSearchDialog {...(defaultProps as any)} />);
    expect(screen.getByText('Gen ID')).toBeInTheDocument();
    expect(screen.getByText('Document Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
  });

  it('calls onClose when Cancel clicked', async () => {
    const user = userEvent.setup();
    render(<AdvancedSearchDialog {...(defaultProps as any)} />);
    await user.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
