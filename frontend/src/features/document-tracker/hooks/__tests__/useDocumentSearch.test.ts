import { jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.unstable_mockModule('../../api/documentTrackerApi', () => ({
  documentTrackerApi: {
    search: jest.fn().mockResolvedValue({
      data: [{ id: 1, genId: 'GEN001' }],
      pagination: { currentPage: 0, pageSize: 25, totalElements: 1, totalPages: 1 },
    }),
    getDetails: jest.fn().mockResolvedValue({
      genId: 'GEN001',
      documentType: 'PDF',
      subDocuments: [],
    }),
    export: jest.fn().mockResolvedValue(new Blob(['data'])),
  },
}));

const { useDocumentSearch, useDocumentDetails, useDocumentExport } = await import('../useDocumentSearch');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useDocumentSearch', () => {
  it('returns search data', async () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data?.data).toHaveLength(1);
  });

  it('has initial search params', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    expect(result.current.searchParams.pagination).toEqual({ page: 0, size: 25 });
  });

  it('exposes handleSearch', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    expect(typeof result.current.handleSearch).toBe('function');
  });

  it('exposes handlePageChange', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    expect(typeof result.current.handlePageChange).toBe('function');
  });

  it('exposes handleSort', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    expect(typeof result.current.handleSort).toBe('function');
  });

  it('exposes handleReset', () => {
    const { result } = renderHook(() => useDocumentSearch(), { wrapper: createWrapper() });
    expect(typeof result.current.handleReset).toBe('function');
  });
});

describe('useDocumentDetails', () => {
  it('fetches details when genId is provided', async () => {
    const { result } = renderHook(() => useDocumentDetails('GEN001'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data?.genId).toBe('GEN001');
  });

  it('does not fetch when genId is empty', () => {
    const { result } = renderHook(() => useDocumentDetails(''), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
  });
});
