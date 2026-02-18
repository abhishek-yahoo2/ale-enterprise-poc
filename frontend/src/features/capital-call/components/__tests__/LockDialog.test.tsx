import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.unstable_mockModule('../../hooks/useCapitalCallWorkflow', () => ({
  useUnlockCapitalCall: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.unstable_mockModule('@/components/ui/Dialog', () => ({
  Dialog: ({ isOpen, children }: any) =>
    isOpen ? React.createElement('div', { 'data-testid': 'dialog' }, children) : null,
  DialogContent: ({ children }: any) => React.createElement('div', null, children),
  DialogFooter: ({ children }: any) => React.createElement('div', null, children),
  DialogHeader: ({ title, children }: any) =>
    React.createElement('div', null, React.createElement('span', null, title), children),
  DialogTitle: ({ children }: any) => React.createElement('h2', null, children),
}));

jest.unstable_mockModule('@/components/ui/Button', () => ({
  default: ({ children, ...props }: any) => React.createElement('button', props, children),
}));

jest.unstable_mockModule('lucide-react', () => ({
  Lock: () => React.createElement('span', null, 'LockIcon'),
  AlertCircle: () => React.createElement('span', null, 'AlertIcon'),
}));

const { LockDialog } = await import('../LockDialog');

describe('LockDialog', () => {
  const mockOnClose = jest.fn() as any;
  const baseCc = {
    id: 1, sla: 'NO', noticePayDate: '2025-01-01', wirePayDate: null, instructionType: 'CALL',
    clientName: 'Test', assetDescription: 'Test', accountId: '12345', assetId: '00012345',
    accountType: 'DV', currency: 'USD', amount: 1000, ntTech: 'XYZ12', toeReference: 'TOE-001',
    aleBatchId: 'BATCH-001', status: 'DRAFT', due: null, fromDate: null, toDate: null,
    dayType: null, techRegion: null, queue: null, signOff: null, workflowStatus: 'DRAFT' as any,
    lockedBy: 'AK915', lockedAt: '2025-01-15T10:00:00Z', isSensitive: false, hasAlert: false,
    createdAt: '2025-01-01', createdBy: 'admin', modifiedAt: null, modifiedBy: null, version: 1,
  };

  beforeEach(() => { jest.clearAllMocks(); });

  it('renders nothing when capitalCall is null', () => {
    const { container } = render(<LockDialog open={true} onClose={mockOnClose} capitalCall={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when open is false', () => {
    const { container } = render(<LockDialog open={false} onClose={mockOnClose} capitalCall={baseCc} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows locked-by information', () => {
    render(<LockDialog open={true} onClose={mockOnClose} capitalCall={baseCc} />);
    expect(screen.getByText('Locked by AK915')).toBeInTheDocument();
  });

  it('shows lockedAt timestamp', () => {
    render(<LockDialog open={true} onClose={mockOnClose} capitalCall={baseCc} />);
    expect(screen.getByText(/Since:/)).toBeInTheDocument();
  });

  it('hides Since text when lockedAt is null', () => {
    const ccNoDate = { ...baseCc, lockedAt: null };
    render(<LockDialog open={true} onClose={mockOnClose} capitalCall={ccNoDate} />);
    expect(screen.queryByText(/Since:/)).not.toBeInTheDocument();
  });

  it('shows descriptive text', () => {
    render(<LockDialog open={true} onClose={mockOnClose} capitalCall={baseCc} />);
    expect(screen.getByText(/currently being edited by another user/)).toBeInTheDocument();
  });

  it('calls onClose when OK is clicked', async () => {
    const user = userEvent.setup();
    render(<LockDialog open={true} onClose={mockOnClose} capitalCall={baseCc} />);
    await user.click(screen.getByText('OK'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
