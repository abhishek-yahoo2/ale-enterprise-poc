import { jest } from '@jest/globals';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../api/documentTrackerApi', () => ({
  documentTrackerApi: {
    search: jest.fn().mockResolvedValue({ data: [], pagination: { page: 0, size: 25, totalElements: 0, totalPages: 0 } }),
    getDetails: jest.fn().mockResolvedValue({ genId: 'GEN001', documentType: 'TYPE1' }),
    export: jest.fn().mockResolvedValue(new Blob()),
  },
}));

const { useDocumentSearch, useDocumentDetails, useDocumentExport } = await import('../useDocumentSearch');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useDocumentSearch', () => {
  it('returns search data and handlers', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    expect(result.current.handleSearch).toBeDefined();
    expect(result.current.handlePageChange).toBeDefined();
    expect(result.current.handleSort).toBeDefined();
    expect(result.current.handleReset).toBeDefined();
    expect(result.current.refetch).toBeDefined();
  });

  it('handleSearch updates filters and resets page to 0', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSearch({ type: 'INVOICE' }));
    expect(result.current.searchParams.filters).toEqual({ type: 'INVOICE' });
    expect(result.current.searchParams.pagination.page).toBe(0);
  });

  it('handlePageChange updates page number', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    act(() => result.current.handlePageChange(3));
    expect(result.current.searchParams.pagination.page).toBe(3);
  });

  it('handleSort updates sort parameters', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSort('genId', 'DESC'));
    expect(result.current.searchParams.sort).toEqual([{ field: 'genId', direction: 'DESC' }]);
  });

  it('handleReset resets to defaults', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    act(() => result.current.handleSearch({ type: 'X' }));
    act(() => result.current.handleSort('genId', 'DESC'));
    act(() => result.current.handleReset());
    expect(result.current.searchParams.filters).toEqual({});
    expect(result.current.searchParams.pagination.page).toBe(0);
    expect(result.current.searchParams.sort).toEqual([]);
  });
});

describe('useDocumentDetails', () => {
  it('does not fetch when genId is empty', () => {
    const { result } = renderHook(() => useDocumentDetails(''), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('fetches when genId is provided', () => {
    const { result } = renderHook(() => useDocumentDetails('GEN001'), { wrapper: createWrapper() });
    expect(result.current).toBeDefined();
  });
});

describe('useDocumentExport', () => {
  it('returns a mutation', () => {
    const { result } = renderHook(() => useDocumentExport(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
  });
});
