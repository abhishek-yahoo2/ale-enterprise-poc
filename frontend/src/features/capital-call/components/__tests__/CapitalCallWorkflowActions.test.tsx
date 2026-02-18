import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSubmitMutateAsync = jest.fn().mockResolvedValue({});
const mockApproveMutateAsync = jest.fn().mockResolvedValue({});
const mockRejectMutateAsync = jest.fn().mockResolvedValue({});
const mockUnlockMutateAsync = jest.fn().mockResolvedValue({});

jest.unstable_mockModule('../../hooks/useCapitalCallWorkflow', () => ({
  useSubmitCapitalCall: () => ({ mutateAsync: mockSubmitMutateAsync, isPending: false }),
  useApproveCapitalCall: () => ({ mutateAsync: mockApproveMutateAsync, isPending: false }),
  useRejectCapitalCall: () => ({ mutateAsync: mockRejectMutateAsync, isPending: false }),
  useUnlockCapitalCall: () => ({ mutateAsync: mockUnlockMutateAsync, isPending: false }),
}));

jest.unstable_mockModule('@/components/ui/Button', () => ({
  default: ({ children, ...props }: any) => React.createElement('button', props, children),
}));

jest.unstable_mockModule('@/types/api', () => ({
  WorkflowStatus: { DRAFT: 'DRAFT', SUBMITTED: 'SUBMITTED', APPROVED: 'APPROVED', REJECTED: 'REJECTED' },
}));

const { CapitalCallWorkflowActions } = await import('../CapitalCallWorkflowActions');

describe('CapitalCallWorkflowActions', () => {
  const baseCapitalCall = {
    id: 1, aleBatchId: 'BATCH-001', fromDate: null, toDate: null, dayType: null,
    totalAmount: 1000, workflowStatus: 'DRAFT' as any, lockedBy: null, lockedAt: null,
    clientName: 'Test', assetDescription: 'Test', isSensitive: false,
    createdAt: '2025-01-01', createdBy: 'admin', breakdowns: [], comments: [], auditTrail: [],
  };

  beforeEach(() => { jest.clearAllMocks(); });

  it('shows Submit for Approval when DRAFT + RULE_SUBMIT', () => {
    render(<CapitalCallWorkflowActions capitalCall={baseCapitalCall} userPermissions={['RULE_SUBMIT']} />);
    expect(screen.getByText('Submit for Approval')).toBeInTheDocument();
  });

  it('calls submitMutateAsync on Submit click with confirm', async () => {
    window.confirm = jest.fn(() => true) as any;
    const user = userEvent.setup();
    render(<CapitalCallWorkflowActions capitalCall={baseCapitalCall} userPermissions={['RULE_SUBMIT']} />);
    await user.click(screen.getByText('Submit for Approval'));
    expect(mockSubmitMutateAsync).toHaveBeenCalledWith(1);
  });

  it('does not call submit when confirm is cancelled', async () => {
    window.confirm = jest.fn(() => false) as any;
    const user = userEvent.setup();
    render(<CapitalCallWorkflowActions capitalCall={baseCapitalCall} userPermissions={['RULE_SUBMIT']} />);
    await user.click(screen.getByText('Submit for Approval'));
    expect(mockSubmitMutateAsync).not.toHaveBeenCalled();
  });

  it('shows Approve and Reject when SUBMITTED + RULE_APPROVE', () => {
    const cc = { ...baseCapitalCall, workflowStatus: 'SUBMITTED' as any };
    render(<CapitalCallWorkflowActions capitalCall={cc} userPermissions={['RULE_APPROVE']} />);
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('calls approveMutateAsync on Approve click', async () => {
    window.confirm = jest.fn(() => true) as any;
    const cc = { ...baseCapitalCall, workflowStatus: 'SUBMITTED' as any };
    const user = userEvent.setup();
    render(<CapitalCallWorkflowActions capitalCall={cc} userPermissions={['RULE_APPROVE']} />);
    await user.click(screen.getByText('Approve'));
    expect(mockApproveMutateAsync).toHaveBeenCalledWith(1);
  });

  it('calls rejectMutateAsync on Reject click', async () => {
    window.confirm = jest.fn(() => true) as any;
    const cc = { ...baseCapitalCall, workflowStatus: 'SUBMITTED' as any };
    const user = userEvent.setup();
    render(<CapitalCallWorkflowActions capitalCall={cc} userPermissions={['RULE_APPROVE']} />);
    await user.click(screen.getByText('Reject'));
    expect(mockRejectMutateAsync).toHaveBeenCalledWith(1);
  });

  it('shows Submit Again when REJECTED + RULE_SUBMIT', () => {
    const cc = { ...baseCapitalCall, workflowStatus: 'REJECTED' as any };
    render(<CapitalCallWorkflowActions capitalCall={cc} userPermissions={['RULE_SUBMIT']} />);
    expect(screen.getByText('Submit Again')).toBeInTheDocument();
  });

  it('shows Force Unlock when locked + RULE_UNLOCK_WORK_ITEM', () => {
    const cc = { ...baseCapitalCall, lockedBy: 'user1' };
    render(<CapitalCallWorkflowActions capitalCall={cc} userPermissions={['RULE_UNLOCK_WORK_ITEM']} />);
    expect(screen.getByText('Force Unlock')).toBeInTheDocument();
  });

  it('calls unlockMutateAsync on Force Unlock click', async () => {
    window.confirm = jest.fn(() => true) as any;
    const cc = { ...baseCapitalCall, lockedBy: 'user1' };
    const user = userEvent.setup();
    render(<CapitalCallWorkflowActions capitalCall={cc} userPermissions={['RULE_UNLOCK_WORK_ITEM']} />);
    await user.click(screen.getByText('Force Unlock'));
    expect(mockUnlockMutateAsync).toHaveBeenCalledWith(1);
  });

  it('does not show Force Unlock when lockedBy is SYSTEM', () => {
    const cc = { ...baseCapitalCall, lockedBy: 'SYSTEM' };
    render(<CapitalCallWorkflowActions capitalCall={cc} userPermissions={['RULE_UNLOCK_WORK_ITEM']} />);
    expect(screen.queryByText('Force Unlock')).not.toBeInTheDocument();
  });

  it('displays status badges for all statuses', () => {
    const { rerender } = render(<CapitalCallWorkflowActions capitalCall={baseCapitalCall} userPermissions={[]} />);
    expect(screen.getByText('DRAFT')).toBeInTheDocument();

    rerender(<CapitalCallWorkflowActions capitalCall={{ ...baseCapitalCall, workflowStatus: 'SUBMITTED' as any }} userPermissions={[]} />);
    expect(screen.getByText('SUBMITTED')).toBeInTheDocument();

    rerender(<CapitalCallWorkflowActions capitalCall={{ ...baseCapitalCall, workflowStatus: 'APPROVED' as any }} userPermissions={[]} />);
    expect(screen.getByText('APPROVED')).toBeInTheDocument();

    rerender(<CapitalCallWorkflowActions capitalCall={{ ...baseCapitalCall, workflowStatus: 'REJECTED' as any }} userPermissions={[]} />);
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
  });

  it('calls onActionComplete after submit', async () => {
    window.confirm = jest.fn(() => true) as any;
    const onActionComplete = jest.fn();
    const user = userEvent.setup();
    render(<CapitalCallWorkflowActions capitalCall={baseCapitalCall} userPermissions={['RULE_SUBMIT']} onActionComplete={onActionComplete as any} />);
    await user.click(screen.getByText('Submit for Approval'));
    expect(onActionComplete).toHaveBeenCalled();
  });
});
