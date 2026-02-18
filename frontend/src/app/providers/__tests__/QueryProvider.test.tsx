import React from 'react';
import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryProvider } from '../QueryProvider';

const TestConsumer = () => {
  const queryClient = useQueryClient();
  return <div data-testid="defaults">{queryClient.getDefaultOptions().queries?.staleTime}</div>;
};

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider><div>Child</div></QueryProvider>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('provides query client with configured defaults', () => {
    render(
      <QueryProvider><TestConsumer /></QueryProvider>
    );
    expect(screen.getByTestId('defaults').textContent).toBe('300000');
  });
});
