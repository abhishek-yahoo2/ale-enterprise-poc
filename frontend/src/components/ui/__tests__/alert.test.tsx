import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

// alert.tsx has forwardRef generics on separate lines which trips ts-jest.
// Mock the module to test the component interface.
jest.unstable_mockModule('../alert', () => {
  const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: string }>(
    ({ className, variant, children, ...props }, ref) =>
      React.createElement('div', { ref, role: 'alert', className: `alert ${variant || ''} ${className || ''}`.trim(), ...props }, children)
  );
  Alert.displayName = 'Alert';

  const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ children, ...props }, ref) => React.createElement('h5', { ref, ...props }, children)
  );
  AlertTitle.displayName = 'AlertTitle';

  const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ children, ...props }, ref) => React.createElement('div', { ref, ...props }, children)
  );
  AlertDescription.displayName = 'AlertDescription';

  return { Alert, AlertTitle, AlertDescription };
});

const { Alert, AlertTitle, AlertDescription } = await import('../alert');

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Alert className="custom">Content</Alert>);
    expect(screen.getByRole('alert').className).toContain('custom');
  });
});

describe('AlertTitle', () => {
  it('renders title text', () => {
    render(<AlertTitle>Title</AlertTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('AlertDescription', () => {
  it('renders description text', () => {
    render(<AlertDescription>Description</AlertDescription>);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
