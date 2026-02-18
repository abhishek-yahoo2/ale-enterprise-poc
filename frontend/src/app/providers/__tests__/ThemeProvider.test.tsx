import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider><div>Themed content</div></ThemeProvider>
    );
    expect(screen.getByText('Themed content')).toBeInTheDocument();
  });

  it('does not add wrapper elements', () => {
    const { container } = render(
      <ThemeProvider><span>Content</span></ThemeProvider>
    );
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });
});
