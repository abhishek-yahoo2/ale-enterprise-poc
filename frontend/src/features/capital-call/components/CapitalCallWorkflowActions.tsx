import React from 'react';
import Button from '@/components/ui/Button';
import { WorkflowStatus } from '@/types/api';
import type { CapitalCallDetails } from '@/types/api';
import {
  useSubmitCapitalCall,
  useApproveCapitalCall,
  useRejectCapitalCall,
  useUnlockCapitalCall,
} from '../hooks/useCapitalCallWorkflow';

interface CapitalCallWorkflowActionsProps {
  capitalCall: CapitalCallDetails;
  userPermissions: string[];
  onActionComplete?: (updatedData: CapitalCallDetails) => void;
}

export const CapitalCallWorkflowActions: React.FC<CapitalCallWorkflowActionsProps> = ({
  capitalCall,
  userPermissions,
  onActionComplete,
}) => {
  const submitMutation = useSubmitCapitalCall();
  const approveMutation = useApproveCapitalCall();
  const rejectMutation = useRejectCapitalCall();
  const unlockMutation = useUnlockCapitalCall();

  const hasPermission = (permission: string) => userPermissions.includes(permission);
  const canSubmit = hasPermission('RULE_SUBMIT');
  const canApprove = hasPermission('RULE_APPROVE');
  const canUnlock = hasPermission('RULE_UNLOCK_WORK_ITEM');

  const handleSubmit = async () => {
    if (
      confirm(
        'Are you sure you want to submit this capital call for approval? You will not be able to edit it until reviewed.',
      )
    ) {
      const result = await submitMutation.mutateAsync(capitalCall.id);
      onActionComplete?.(capitalCall);
    }
  };

  const handleApprove = async () => {
    if (confirm('Are you sure you want to approve this capital call?')) {
      const result = await approveMutation.mutateAsync(capitalCall.id);
      onActionComplete?.(result);
    }
  };

  const handleReject = async () => {
    if (
      confirm(
        'Are you sure you want to reject this capital call? It will be returned to draft status for edits.',
      )
    ) {
      const result = await rejectMutation.mutateAsync(capitalCall.id);
      onActionComplete?.(result);
    }
  };

  const handleUnlock = async () => {
    if (confirm('Are you sure you want to force unlock this capital call?')) {
      await unlockMutation.mutateAsync(capitalCall.id);
    }
  };

  const isLoading =
    submitMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    unlockMutation.isPending;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* DRAFT Status - Can Submit */}
      {capitalCall.workflowStatus === WorkflowStatus.DRAFT && canSubmit && (
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
          size="small"
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
        </Button>
      )}

      {/* SUBMITTED Status - Can Approve or Reject */}
      {capitalCall.workflowStatus === WorkflowStatus.SUBMITTED && canApprove && (
        <>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
            size="small"
          >
            {approveMutation.isPending ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
            size="small"
          >
            {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
          </Button>
        </>
      )}

      {/* REJECTED Status - Can Submit Again */}
      {capitalCall.workflowStatus === WorkflowStatus.REJECTED && canSubmit && (
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
          size="small"
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Again'}
        </Button>
      )}

      {/* Locked Capital Call - Can Unlock (Admin Only) */}
      {capitalCall.lockedBy && capitalCall.lockedBy !== 'SYSTEM' && canUnlock && (
        <Button
          onClick={handleUnlock}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700"
          size="small"
          variant="outline"
        >
          {unlockMutation.isPending ? 'Unlocking...' : 'Force Unlock'}
        </Button>
      )}

      {/* Status Badge */}
      <div className={`px-3 py-1 rounded text-sm font-medium ${getStatusBadgeClass(capitalCall.workflowStatus)}`}>
        {capitalCall.workflowStatus}
      </div>
    </div>
  );
};

function getStatusBadgeClass(status: WorkflowStatus): string {
  switch (status) {
    case WorkflowStatus.DRAFT:
      return 'bg-gray-100 text-gray-800';
    case WorkflowStatus.SUBMITTED:
      return 'bg-blue-100 text-blue-800';
    case WorkflowStatus.APPROVED:
      return 'bg-green-100 text-green-800';
    case WorkflowStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
