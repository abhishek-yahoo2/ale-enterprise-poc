import { jest } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockSubmit = jest.fn().mockResolvedValue({ id: 1, workflowStatus: 'SUBMITTED' });
const mockApprove = jest.fn().mockResolvedValue({ id: 1, workflowStatus: 'APPROVED' });
const mockReject = jest.fn().mockResolvedValue({ id: 1, workflowStatus: 'DRAFT' });
const mockUnlock = jest.fn().mockResolvedValue(undefined);

jest.unstable_mockModule('../../api/capitalCallApi', () => ({
  capitalCallApi: {
    submit: mockSubmit,
    approve: mockApprove,
    reject: mockReject,
    unlock: mockUnlock,
  },
}));

const mockToast = { success: jest.fn(), error: jest.fn() };
jest.unstable_mockModule('sonner', () => ({
  toast: mockToast,
}));

const { useCapitalCallWorkflow, useSubmitCapitalCall, useApproveCapitalCall, useRejectCapitalCall, useUnlockCapitalCall } = await import('../useCapitalCallWorkflow');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCapitalCallWorkflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubmit.mockResolvedValue({ id: 1, workflowStatus: 'SUBMITTED' });
    mockApprove.mockResolvedValue({ id: 1, workflowStatus: 'APPROVED' });
    mockReject.mockResolvedValue({ id: 1, workflowStatus: 'DRAFT' });
    mockUnlock.mockResolvedValue(undefined);
  });

  it('returns submit, approve, reject, unlock', () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    expect(result.current.submit).toBeDefined();
    expect(result.current.approve).toBeDefined();
    expect(result.current.reject).toBeDefined();
    expect(result.current.unlock).toBeDefined();
  });

  it('isLoading is false initially', () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(false);
  });

  it('submit mutation works and shows success toast', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => { result.current.submit.mutate(1); });
    await waitFor(() => expect(result.current.submit.isSuccess).toBe(true));
    expect(mockToast.success).toHaveBeenCalledWith('Capital call submitted for approval');
  });

  it('submit mutation shows error toast on failure', async () => {
    mockSubmit.mockRejectedValueOnce({ response: { data: { message: 'Submit failed' } } });
    const { result } = renderHook(() => useSubmitCapitalCall(), { wrapper: createWrapper() });
    await act(async () => { result.current.mutate(1); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockToast.error).toHaveBeenCalledWith('Submit failed');
  });

  it('submit mutation shows fallback error when no message', async () => {
    mockSubmit.mockRejectedValueOnce({});
    const { result } = renderHook(() => useSubmitCapitalCall(), { wrapper: createWrapper() });
    await act(async () => { result.current.mutate(1); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockToast.error).toHaveBeenCalledWith('Failed to submit capital call');
  });

  it('approve mutation works and shows success toast', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => { result.current.approve.mutate(1); });
    await waitFor(() => expect(result.current.approve.isSuccess).toBe(true));
    expect(mockToast.success).toHaveBeenCalledWith('Capital call approved successfully');
  });

  it('approve mutation shows error toast on failure', async () => {
    mockApprove.mockRejectedValueOnce({ response: { data: { message: 'Approve denied' } } });
    const { result } = renderHook(() => useApproveCapitalCall(), { wrapper: createWrapper() });
    await act(async () => { result.current.mutate(1); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockToast.error).toHaveBeenCalledWith('Approve denied');
  });

  it('reject mutation works and shows success toast', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => { result.current.reject.mutate(1); });
    await waitFor(() => expect(result.current.reject.isSuccess).toBe(true));
    expect(mockToast.success).toHaveBeenCalledWith('Capital call rejected and returned to draft');
  });

  it('reject mutation shows error toast on failure', async () => {
    mockReject.mockRejectedValueOnce({});
    const { result } = renderHook(() => useRejectCapitalCall(), { wrapper: createWrapper() });
    await act(async () => { result.current.mutate(1); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockToast.error).toHaveBeenCalledWith('Failed to reject capital call');
  });

  it('unlock mutation works and shows success toast', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => { result.current.unlock.mutate(1); });
    await waitFor(() => expect(result.current.unlock.isSuccess).toBe(true));
    expect(mockToast.success).toHaveBeenCalledWith('Capital call unlocked successfully');
  });

  it('unlock mutation shows error toast on failure', async () => {
    mockUnlock.mockRejectedValueOnce({});
    const { result } = renderHook(() => useUnlockCapitalCall(), { wrapper: createWrapper() });
    await act(async () => { result.current.mutate(1); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockToast.error).toHaveBeenCalledWith('Failed to unlock capital call');
  });
});
