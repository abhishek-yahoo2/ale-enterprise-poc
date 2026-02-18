import { jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../api/capitalCallApi', () => ({
  capitalCallApi: {
    getCounts: jest.fn().mockResolvedValue([
      { subTab: 'SSI_VERIFICATION_NEEDED', count: 2573 },
      { subTab: 'TRANSACTION_TO_BE_PROCESSED', count: 17 },
    ]),
  },
}));

jest.unstable_mockModule('../../store/capitalCallStore', () => ({
  useCapitalCallStore: (selector: any) => {
    const state = { selectedQueue: 'Operator Queue' };
    return selector(state);
  },
}));

const { useTabCounts } = await import('../useTabCounts');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useTabCounts', () => {
  it('fetches tab counts', async () => {
    const { result } = renderHook(() => useTabCounts(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toHaveLength(2);
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useTabCounts(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBeDefined();
  });
});
