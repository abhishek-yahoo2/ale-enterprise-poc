import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.unstable_mockModule('@/components/ui/Dialog', () => ({
  Dialog: ({ isOpen, children }: any) =>
    isOpen ? React.createElement('div', { 'data-testid': 'dialog' }, children) : null,
  DialogContent: ({ children }: any) => React.createElement('div', null, children),
  DialogDescription: ({ children }: any) => React.createElement('p', null, children),
  DialogFooter: ({ children }: any) => React.createElement('div', null, children),
  DialogHeader: ({ children }: any) => React.createElement('div', null, children),
  DialogTitle: ({ children }: any) => React.createElement('h2', null, children),
}));

jest.unstable_mockModule('@/components/ui/Button', () => ({
  default: ({ children, ...props }: any) => React.createElement('button', props, children),
}));

const { default: ApprovalDialog } = await import('../ApprovalDialog');

describe('ApprovalDialog', () => {
  const mockOnClose = jest.fn() as any;
  const mockOnConfirm = jest.fn() as any;

  beforeEach(() => { jest.clearAllMocks(); });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ApprovalDialog isOpen={false} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders dialog content when isOpen is true', () => {
    render(<ApprovalDialog isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    expect(screen.getByText('Confirm Approval')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ApprovalDialog isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    expect(screen.getByText(/Are you sure you want to approve/)).toBeInTheDocument();
  });

  it('renders Cancel and Approve buttons', () => {
    render(<ApprovalDialog isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Approve')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<ApprovalDialog isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm and onClose when Approve is clicked', async () => {
    const user = userEvent.setup();
    render(<ApprovalDialog isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    await user.click(screen.getByText('Approve'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
