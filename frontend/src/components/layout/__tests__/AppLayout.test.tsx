import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.unstable_mockModule('../Header', () => ({
  Header: (props: any) => <div data-testid="header">Header</div>,
}));

jest.unstable_mockModule('../Sidebar', () => ({
  Sidebar: (props: any) => <div data-testid="sidebar">Sidebar</div>,
}));

const { AppLayout } = await import('../AppLayout');

describe('AppLayout', () => {
  it('renders children content', () => {
    render(
      <AppLayout>
        <div data-testid="child-content">Hello World</div>
      </AppLayout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders the header', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );
    expect(
      screen.getByText(
        /2026 Application Lifecycle Engine\. All rights reserved\./
      )
    ).toBeInTheDocument();
  });
});
