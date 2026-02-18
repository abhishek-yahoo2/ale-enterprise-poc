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

const { useAlternativeDataSearch, useColumnPreferences, useAlternativeDataExport } = await import('../useAlternativeDataSearch');

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

  it('handleSearch updates filters and resets page', () => {
    const { result } = renderHook(() => useAlternativeDataSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSearch({ name: 'test' }));
    expect(result.current.searchParams.filters).toEqual({ name: 'test' });
    expect(result.current.searchParams.pagination.page).toBe(0);
  });

  it('handlePageChange updates page', () => {
    const { result } = renderHook(() => useAlternativeDataSearch(), { wrapper: createWrapper() });
    act(() => result.current.handlePageChange(2));
    expect(result.current.searchParams.pagination.page).toBe(2);
  });

  it('handleSort updates sort', () => {
    const { result } = renderHook(() => useAlternativeDataSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSort('name', 'DESC'));
    expect(result.current.searchParams.sort).toEqual({ field: 'name', direction: 'DESC' });
  });

  it('handleReset resets to defaults', () => {
    const { result } = renderHook(() => useAlternativeDataSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSearch({ name: 'test' }));
    act(() => result.current.handleReset());
    expect(result.current.searchParams.filters).toEqual({});
    expect(result.current.searchParams.pagination.page).toBe(0);
  });
});

describe('useColumnPreferences', () => {
  it('returns query result', () => {
    const { result } = renderHook(() => useColumnPreferences(), { wrapper: createWrapper() });
    expect(result.current).toBeDefined();
  });
});

describe('useAlternativeDataExport', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useAlternativeDataExport(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});
