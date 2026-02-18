import { jest } from '@jest/globals';
import React from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../api/capitalCallApi', () => ({
  capitalCallApi: {
    acquireLock: jest.fn().mockResolvedValue({}),
    releaseLock: jest.fn().mockResolvedValue({}),
    forceUnlock: jest.fn().mockResolvedValue({}),
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
  it('returns acquireLock, releaseLock, forceUnlock mutations', () => {
    const { result } = renderHook(() => useLocking('123'), { wrapper: createWrapper() });
    expect(result.current.acquireLock).toBeDefined();
    expect(result.current.acquireLock.mutate).toBeDefined();
    expect(result.current.releaseLock).toBeDefined();
    expect(result.current.releaseLock.mutate).toBeDefined();
    expect(result.current.forceUnlock).toBeDefined();
    expect(result.current.forceUnlock.mutate).toBeDefined();
  });
});
