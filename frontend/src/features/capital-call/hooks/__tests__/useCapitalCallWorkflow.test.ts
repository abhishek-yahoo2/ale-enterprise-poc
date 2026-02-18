import { jest } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../api/capitalCallApi', () => ({
  capitalCallApi: {
    submit: jest.fn().mockResolvedValue({ id: 1, workflowStatus: 'SUBMITTED' }),
    approve: jest.fn().mockResolvedValue({ id: 1, workflowStatus: 'APPROVED' }),
    reject: jest.fn().mockResolvedValue({ id: 1, workflowStatus: 'DRAFT' }),
    unlock: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.unstable_mockModule('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const { useCapitalCallWorkflow } = await import('../useCapitalCallWorkflow');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCapitalCallWorkflow', () => {
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

  it('submit mutation works', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => {
      result.current.submit.mutate(1);
    });
    await waitFor(() => expect(result.current.submit.isSuccess).toBe(true));
  });

  it('approve mutation works', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => {
      result.current.approve.mutate(1);
    });
    await waitFor(() => expect(result.current.approve.isSuccess).toBe(true));
  });

  it('reject mutation works', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => {
      result.current.reject.mutate(1);
    });
    await waitFor(() => expect(result.current.reject.isSuccess).toBe(true));
  });

  it('unlock mutation works', async () => {
    const { result } = renderHook(() => useCapitalCallWorkflow(), { wrapper: createWrapper() });
    await act(async () => {
      result.current.unlock.mutate(1);
    });
    await waitFor(() => expect(result.current.unlock.isSuccess).toBe(true));
  });
});
