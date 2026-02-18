import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingSpinner message="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('renders inline by default', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.loading-spinner-inline')).toBeInTheDocument();
  });

  it('renders fullPage overlay', () => {
    const { container } = render(<LoadingSpinner fullPage />);
    expect(container.querySelector('.loading-spinner-overlay')).toBeInTheDocument();
  });

  it('applies custom size', () => {
    const { container } = render(<LoadingSpinner size={60} />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toHaveStyle({ width: '60px', height: '60px' });
  });
});
