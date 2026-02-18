import { render, screen } from '@testing-library/react';
import React from 'react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge text="Active" variant="success" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    render(<Badge text="Status" variant="success" />);
    const badge = screen.getByText('Status');
    expect(badge.tagName).toBe('SPAN');
  });

  describe('variants', () => {
    it('renders success variant', () => {
      render(<Badge text="Success" variant="success" />);
      const badge = screen.getByText('Success');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('renders warning variant', () => {
      render(<Badge text="Warning" variant="warning" />);
      const badge = screen.getByText('Warning');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('renders error variant', () => {
      render(<Badge text="Error" variant="error" />);
      const badge = screen.getByText('Error');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  it('applies base classes regardless of variant', () => {
    render(<Badge text="Base" variant="success" />);
    const badge = screen.getByText('Base');
    expect(badge).toHaveClass('inline-block', 'px-2', 'py-1', 'text-sm', 'font-semibold', 'rounded');
  });

  it('applies custom className', () => {
    render(<Badge text="Custom" variant="success" className="my-badge-class" />);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('my-badge-class');
    // Should still have base classes
    expect(badge).toHaveClass('inline-block', 'px-2', 'py-1');
  });

  it('passes through additional HTML span attributes', () => {
    render(<Badge text="Accessible" variant="warning" data-testid="badge-el" aria-label="status badge" />);
    const badge = screen.getByTestId('badge-el');
    expect(badge).toHaveAttribute('aria-label', 'status badge');
    expect(badge).toHaveTextContent('Accessible');
  });
});
