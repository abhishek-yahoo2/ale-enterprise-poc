import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const { Sidebar } = await import('../Sidebar');

const defaultProps = {
  onClose: jest.fn(),
  onToggle: jest.fn(),
};

describe('Sidebar', () => {
  it('renders collapsed strip when not open (desktop)', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={false} onClose={defaultProps.onClose} onToggle={defaultProps.onToggle} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
  });

  it('renders menu items when open', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={defaultProps.onClose} onToggle={defaultProps.onToggle} />
      </MemoryRouter>
    );
    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.getByText('DOCUMENT TRACKER')).toBeInTheDocument();
    expect(screen.getByText('ACCOUNTING & CASH')).toBeInTheDocument();
    expect(screen.getByText('ALTERNATIVE DATA')).toBeInTheDocument();
  });

  it('highlights the active route', () => {
    render(
      <MemoryRouter initialEntries={['/document-tracker']}>
        <Sidebar isOpen={true} onClose={defaultProps.onClose} onToggle={defaultProps.onToggle} />
      </MemoryRouter>
    );
    const activeLink = screen.getByText('DOCUMENT TRACKER').closest('a');
    expect(activeLink).toHaveClass('bg-ale-sidebar-active');
  });

  it('calls onClose when a menu link is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={onClose} onToggle={defaultProps.onToggle} />
      </MemoryRouter>
    );
    await user.click(screen.getByText('HOME'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={onClose} onToggle={defaultProps.onToggle} />
      </MemoryRouter>
    );
    const backdrop = document.querySelector('.fixed.inset-0');
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop as Element);
    expect(onClose).toHaveBeenCalled();
  });
});
