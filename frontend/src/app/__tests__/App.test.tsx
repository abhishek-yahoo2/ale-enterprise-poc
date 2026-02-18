import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the heavy dependencies
jest.unstable_mockModule('../Router', () => ({
  Router: () => React.createElement('div', { 'data-testid': 'router' }, 'Router'),
  default: () => React.createElement('div', { 'data-testid': 'router' }, 'Router'),
}));

jest.unstable_mockModule('sonner', () => ({
  Toaster: () => React.createElement('div', { 'data-testid': 'toaster' }, 'Toaster'),
}));

jest.unstable_mockModule('@/styles/globals.css', () => ({}));

const { default: App } = await import('../App');

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('router')).toBeInTheDocument();
  });

  it('renders Toaster', () => {
    render(<App />);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
