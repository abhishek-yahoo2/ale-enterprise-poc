import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.unstable_mockModule('../Header', () => ({
  Header: (props: any) =>
    React.createElement('div', { 'data-testid': 'header' },
      React.createElement('button', { onClick: props.onToggleSidebar, 'data-testid': 'toggle-btn' }, 'Toggle')
    ),
}));

jest.unstable_mockModule('../Sidebar', () => ({
  Sidebar: (props: any) =>
    React.createElement('div', { 'data-testid': 'sidebar' },
      React.createElement('span', null, props.isOpen ? 'open' : 'closed'),
      React.createElement('button', { onClick: props.onClose, 'data-testid': 'close-btn' }, 'Close'),
      React.createElement('button', { onClick: props.onToggle, 'data-testid': 'sidebar-toggle' }, 'SidebarToggle')
    ),
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
    render(<AppLayout><div>Content</div></AppLayout>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<AppLayout><div>Content</div></AppLayout>);
    expect(screen.getByText(/2026 Application Lifecycle Engine\. All rights reserved\./)).toBeInTheDocument();
  });

  it('toggles sidebar when header toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<AppLayout><div>Content</div></AppLayout>);
    expect(screen.getByText('open')).toBeInTheDocument();
    await user.click(screen.getByTestId('toggle-btn'));
    expect(screen.getByText('closed')).toBeInTheDocument();
  });

  it('closes sidebar when close is clicked', async () => {
    const user = userEvent.setup();
    render(<AppLayout><div>Content</div></AppLayout>);
    expect(screen.getByText('open')).toBeInTheDocument();
    await user.click(screen.getByTestId('close-btn'));
    expect(screen.getByText('closed')).toBeInTheDocument();
  });
});
