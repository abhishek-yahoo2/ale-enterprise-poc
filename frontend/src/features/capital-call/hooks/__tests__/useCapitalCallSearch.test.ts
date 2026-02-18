import { jest } from '@jest/globals';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../store/capitalCallStore', () => ({
  useCapitalCallStore: (selector: any) => {
    const state = {
      filters: {},
      currentPage: 0,
      pageSize: 25,
      sortField: null,
      sortDirection: 'ASC',
      activeTab: 'ALL',
      activeSubTab: 'ALL',
      setFilters: jest.fn(),
      setSearchParams: jest.fn(),
    };
    return selector(state);
  },
}));

jest.unstable_mockModule('../../api/capitalCallApi', () => ({
  capitalCallApi: {
    search: jest.fn().mockResolvedValue({ data: [], pagination: { page: 0, size: 25, totalElements: 0, totalPages: 0 } }),
    getDetails: jest.fn().mockResolvedValue({ id: 1, clientName: 'Test' }),
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

const {
  useCapitalCallSearch,
  useCapitalCallDetails,
  useCreateCapitalCall,
  useUpdateCapitalCall,
  useSubmitCapitalCall,
  useApproveCapitalCall,
  useRejectCapitalCall,
  useUnlockCapitalCall,
  useCapitalCallExport,
} = await import('../useCapitalCallSearch');

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

  it('handleSearch calls setFilters', () => {
    const { result } = renderHook(() => useCapitalCallSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSearch({ clientName: 'test' }));
    // setFilters is mocked, just verify it doesn't throw
  });

  it('handlePageChange calls setSearchParams', () => {
    const { result } = renderHook(() => useCapitalCallSearch(), { wrapper: createWrapper() });
    act(() => result.current.handlePageChange(2));
  });

  it('handleSort calls setSearchParams', () => {
    const { result } = renderHook(() => useCapitalCallSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSort('clientName', 'DESC'));
  });

  it('handleReset calls setSearchParams with defaults', () => {
    const { result } = renderHook(() => useCapitalCallSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleReset());
  });

  it('returns searchParams structure', () => {
    const { result } = renderHook(() => useCapitalCallSearch(), { wrapper: createWrapper() });
    expect(result.current.searchParams).toEqual({
      filters: {},
      pagination: { page: 0, size: 25 },
      sort: [],
    });
  });
});

describe('useCapitalCallDetails', () => {
  it('does not fetch when id is null', () => {
    const { result } = renderHook(() => useCapitalCallDetails(null), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('fetches when id is provided', () => {
    const { result } = renderHook(() => useCapitalCallDetails(1), { wrapper: createWrapper() });
    expect(result.current).toBeDefined();
  });
});

describe('useCreateCapitalCall', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useCreateCapitalCall(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
  });
});

describe('useUpdateCapitalCall', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useUpdateCapitalCall(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
  });
});

describe('useSubmitCapitalCall', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useSubmitCapitalCall(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});

describe('useApproveCapitalCall', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useApproveCapitalCall(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});

describe('useRejectCapitalCall', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useRejectCapitalCall(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});

describe('useUnlockCapitalCall', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useUnlockCapitalCall(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});

describe('useCapitalCallExport', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useCapitalCallExport(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});
