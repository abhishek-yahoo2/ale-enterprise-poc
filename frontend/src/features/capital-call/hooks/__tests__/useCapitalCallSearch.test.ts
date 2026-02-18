import { jest } from '@jest/globals';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../api/capitalCallApi', () => ({
  capitalCallApi: {
    search: jest.fn().mockResolvedValue({ data: [], pagination: { page: 0, size: 25, totalElements: 0, totalPages: 0 } }),
    getDetails: jest.fn().mockResolvedValue({ id: 1 }),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    submit: jest.fn().mockResolvedValue({}),
    approve: jest.fn().mockResolvedValue({}),
    reject: jest.fn().mockResolvedValue({}),
    unlock: jest.fn().mockResolvedValue({}),
    export: jest.fn().mockResolvedValue(new Blob()),
  },
}));

jest.unstable_mockModule('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const { useCapitalCallSearch, useCapitalCallDetails, useCreateCapitalCall } = await import('../useCapitalCallSearch');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useCapitalCallSearch', () => {
  it('returns search data and handlers', () => {
    const { result } = renderHook(() => useCapitalCallSearch(), { wrapper: createWrapper() });
    expect(result.current.handleSearch).toBeDefined();
    expect(result.current.handlePageChange).toBeDefined();
    expect(result.current.handleSort).toBeDefined();
    expect(result.current.handleReset).toBeDefined();
    expect(result.current.refetch).toBeDefined();
  });
});

describe('useCapitalCallDetails', () => {
  it('does not fetch when id is null', () => {
    const { result } = renderHook(() => useCapitalCallDetails(null), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });
});

describe('useCreateCapitalCall', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useCreateCapitalCall(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});
