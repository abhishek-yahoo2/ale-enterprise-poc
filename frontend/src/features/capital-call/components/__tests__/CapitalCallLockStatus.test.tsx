import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';

const { CapitalCallLockStatus } = await import('../CapitalCallLockStatus');

describe('CapitalCallLockStatus', () => {
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
      <CapitalCallLockStatus capitalCall={baseCapitalCall} />
    );
    expect(container).toBeDefined();
  });

  it('shows unlocked status when not locked', () => {
    render(<CapitalCallLockStatus capitalCall={baseCapitalCall} />);
    expect(screen.getByText('Not locked - Available for editing')).toBeInTheDocument();
  });

  it('shows locked by another user when locked by someone else', () => {
    const lockedCall = {
      ...baseCapitalCall,
      lockedBy: 'otherUser',
      lockedAt: '2025-01-15T10:00:00Z',
    };
    render(
      <CapitalCallLockStatus capitalCall={lockedCall} currentUser="currentUser" />
    );
    expect(screen.getByText(/Locked by otherUser/)).toBeInTheDocument();
  });

  it('shows locked by you when locked by the current user', () => {
    const lockedCall = {
      ...baseCapitalCall,
      lockedBy: 'myUser',
      lockedAt: '2025-01-15T10:00:00Z',
    };
    render(
      <CapitalCallLockStatus capitalCall={lockedCall} currentUser="myUser" />
    );
    expect(screen.getByText(/Locked by you/)).toBeInTheDocument();
  });
});
