import { useMutation, useQueryClient } from '@tanstack/react-query';
import { capitalCallApi } from '../api/capitalCallApi';
import type { CapitalCallDetails } from '@/types/api';
import { toast } from 'sonner';

/**
 * Hook for submitting a capital call (DRAFT → SUBMITTED)
 */
export const useSubmitCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.submit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      queryClient.invalidateQueries({ queryKey: ['capital-call-details'] });
      toast.success('Capital call submitted for approval');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit capital call');
    },
  });
};

/**
 * Hook for approving a capital call (SUBMITTED → APPROVED)
 */
export const useApproveCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.approve(id),
    onSuccess: (data: CapitalCallDetails) => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      queryClient.setQueryData(['capital-call-details', data.id], data);
      toast.success('Capital call approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve capital call');
    },
  });
};

/**
 * Hook for rejecting a capital call (SUBMITTED → DRAFT)
 */
export const useRejectCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.reject(id),
    onSuccess: (data: CapitalCallDetails) => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      queryClient.setQueryData(['capital-call-details', data.id], data);
      toast.success('Capital call rejected and returned to draft');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject capital call');
    },
  });
};

/**
 * Hook for unlocking a capital call (administrative operation)
 */
export const useUnlockCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.unlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      queryClient.invalidateQueries({ queryKey: ['capital-call-details'] });
      toast.success('Capital call unlocked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to unlock capital call');
    },
  });
};

/**
 * Combined hook for all workflow actions on a capital call
 * Returns all workflow mutation hooks and helper functions
 */
export const useCapitalCallWorkflow = () => {
  const submit = useSubmitCapitalCall();
  const approve = useApproveCapitalCall();
  const reject = useRejectCapitalCall();
  const unlock = useUnlockCapitalCall();

  return {
    submit,
    approve,
    reject,
    unlock,
    isLoading: submit.isPending || approve.isPending || reject.isPending || unlock.isPending,
  };
};
