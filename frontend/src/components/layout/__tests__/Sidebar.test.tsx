import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const { Sidebar } = await import('../Sidebar');

describe('Sidebar', () => {
  it('returns null when not open', () => {
    const onClose = jest.fn();
    const { container } = render(
      <MemoryRouter>
        <Sidebar isOpen={false} onClose={onClose} />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders menu items when open', () => {
    const onClose = jest.fn();
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Document Tracker')).toBeInTheDocument();
    expect(screen.getByText('Accounting & Cash')).toBeInTheDocument();
    expect(screen.getByText('Alternative Data')).toBeInTheDocument();
  });

  it('highlights the active route', () => {
    const onClose = jest.fn();
    render(
      <MemoryRouter initialEntries={['/document-tracker']}>
        <Sidebar isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    const activeLink = screen.getByText('Document Tracker').closest('a');
    expect(activeLink).toHaveClass('bg-primary-dark');
  });

  it('calls onClose when a menu link is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Dashboard'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    // The backdrop is the first div with the bg-black/50 class
    const backdrop = document.querySelector('.fixed.inset-0');
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop as Element);
    expect(onClose).toHaveBeenCalled();
  });
});
