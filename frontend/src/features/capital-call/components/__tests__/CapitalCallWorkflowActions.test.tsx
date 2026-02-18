import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.unstable_mockModule('../../hooks/useCapitalCallWorkflow', () => ({
  useSubmitCapitalCall: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useApproveCapitalCall: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useRejectCapitalCall: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useUnlockCapitalCall: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

jest.unstable_mockModule('@/components/ui/Button', () => ({
  default: ({ children, ...props }: any) =>
    React.createElement('button', props, children),
}));

jest.unstable_mockModule('@/types/api', () => ({
  WorkflowStatus: {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
  },
}));

const { CapitalCallWorkflowActions } = await import('../CapitalCallWorkflowActions');

describe('CapitalCallWorkflowActions', () => {
  const baseCapitalCall = {
    id: 1,
    aleBatchId: 'BATCH-001',
    fromDate: null,
    toDate: null,
    dayType: null,
    totalAmount: 1000,
    workflowStatus: 'DRAFT' as any,
    lockedBy: null,
    lockedAt: null,
    clientName: 'Test Client',
    assetDescription: 'Test Asset',
    isSensitive: false,
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'admin',
    breakdowns: [],
    comments: [],
    auditTrail: [],
  };

  it('renders without crashing', () => {
    const { container } = render(
      <CapitalCallWorkflowActions
        capitalCall={baseCapitalCall}
        userPermissions={['RULE_SUBMIT']}
      />
    );
    expect(container).toBeDefined();
  });

  it('shows Submit for Approval button when status is DRAFT and user has RULE_SUBMIT', () => {
    render(
      <CapitalCallWorkflowActions
        capitalCall={baseCapitalCall}
        userPermissions={['RULE_SUBMIT']}
      />
    );
    expect(screen.getByText('Submit for Approval')).toBeInTheDocument();
  });

  it('shows Approve and Reject buttons when status is SUBMITTED and user has RULE_APPROVE', () => {
    const submittedCall = { ...baseCapitalCall, workflowStatus: 'SUBMITTED' as any };
    render(
      <CapitalCallWorkflowActions
        capitalCall={submittedCall}
        userPermissions={['RULE_APPROVE']}
      />
    );
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('shows the status badge', () => {
    render(
      <CapitalCallWorkflowActions
        capitalCall={baseCapitalCall}
        userPermissions={[]}
      />
    );
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });
});
