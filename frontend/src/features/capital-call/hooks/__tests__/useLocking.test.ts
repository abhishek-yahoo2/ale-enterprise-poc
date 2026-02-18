import { jest } from '@jest/globals';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockAcquireLock = jest.fn().mockResolvedValue({});
const mockReleaseLock = jest.fn().mockResolvedValue({});
const mockForceUnlock = jest.fn().mockResolvedValue({});

jest.unstable_mockModule('../../api/capitalCallApi', () => ({
  capitalCallApi: {
    acquireLock: mockAcquireLock,
    releaseLock: mockReleaseLock,
    forceUnlock: mockForceUnlock,
  },
}));

const { useLocking } = await import('../useLocking');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useLocking', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns acquireLock, releaseLock, forceUnlock mutations', () => {
    const { result } = renderHook(() => useLocking('123'), { wrapper: createWrapper() });
    expect(result.current.acquireLock.mutate).toBeDefined();
    expect(result.current.releaseLock.mutate).toBeDefined();
    expect(result.current.forceUnlock.mutate).toBeDefined();
  });

  it('acquireLock calls API', async () => {
    const { result } = renderHook(() => useLocking('123'), { wrapper: createWrapper() });
    await act(async () => { result.current.acquireLock.mutate(); });
    expect(mockAcquireLock).toHaveBeenCalledWith('123');
  });

  it('releaseLock calls API', async () => {
    const { result } = renderHook(() => useLocking('456'), { wrapper: createWrapper() });
    await act(async () => { result.current.releaseLock.mutate(); });
    expect(mockReleaseLock).toHaveBeenCalledWith('456');
  });

  it('forceUnlock calls API', async () => {
    const { result } = renderHook(() => useLocking('789'), { wrapper: createWrapper() });
    await act(async () => { result.current.forceUnlock.mutate(); });
    expect(mockForceUnlock).toHaveBeenCalledWith('789');
  });
});
