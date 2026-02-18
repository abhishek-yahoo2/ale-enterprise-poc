import { jest } from '@jest/globals';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../api/alternativeMockDataApi', () => ({
  alternativeDataApi: {
    search: jest.fn().mockResolvedValue({ data: [], pagination: { page: 0, size: 25, totalElements: 0, totalPages: 0 } }),
    getColumnPreferences: jest.fn().mockResolvedValue([]),
    saveColumnPreferences: jest.fn().mockResolvedValue({}),
    export: jest.fn().mockResolvedValue(new Blob()),
  },
}));

jest.unstable_mockModule('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const { useAlternativeDataSearch } = await import('../useAlternativeDataSearch');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useAlternativeDataSearch', () => {
  it('returns search data and handlers', () => {
    const { result } = renderHook(() => useAlternativeDataSearch(), { wrapper: createWrapper() });
    expect(result.current.handleSearch).toBeDefined();
    expect(result.current.handlePageChange).toBeDefined();
    expect(result.current.handleSort).toBeDefined();
    expect(result.current.handleReset).toBeDefined();
    expect(result.current.refetch).toBeDefined();
  });

  it('handleSearch updates filters', () => {
    const { result } = renderHook(() => useAlternativeDataSearch(), { wrapper: createWrapper() });
    act(() => {
      result.current.handleSearch({ name: 'test' });
    });
    expect(result.current.searchParams.filters).toEqual({ name: 'test' });
  });

  it('handleReset resets to defaults', () => {
    const { result } = renderHook(() => useAlternativeDataSearch(), { wrapper: createWrapper() });
    act(() => {
      result.current.handleSearch({ name: 'test' });
    });
    act(() => {
      result.current.handleReset();
    });
    expect(result.current.searchParams.filters).toEqual({});
    expect(result.current.searchParams.pagination.page).toBe(0);
  });
});
