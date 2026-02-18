import { renderHook, act } from '@testing-library/react';
import { usePagination, useSort, useDataGridState } from '../hooks';

describe('usePagination', () => {
  it('initializes with default page size', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
  });

  it('initializes with custom page size', () => {
    const { result } = renderHook(() => usePagination(25));
    expect(result.current.pagination.pageSize).toBe(25);
  });

  it('goToPage updates page index', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.goToPage(3));
    expect(result.current.pagination.pageIndex).toBe(3);
  });

  it('setPageSize resets page index to 0', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.goToPage(5));
    act(() => result.current.setPageSize(50));
    expect(result.current.pagination.pageSize).toBe(50);
    expect(result.current.pagination.pageIndex).toBe(0);
  });
});

describe('useSort', () => {
  it('initializes with null sort', () => {
    const { result } = renderHook(() => useSort());
    expect(result.current.sort).toEqual({ sortBy: null, sortDirection: 'asc' });
  });

  it('sets sort column on first click', () => {
    const { result } = renderHook(() => useSort());
    act(() => result.current.onSort('name'));
    expect(result.current.sort).toEqual({ sortBy: 'name', sortDirection: 'asc' });
  });

  it('toggles direction on same column', () => {
    const { result } = renderHook(() => useSort());
    act(() => result.current.onSort('name'));
    act(() => result.current.onSort('name'));
    expect(result.current.sort).toEqual({ sortBy: 'name', sortDirection: 'desc' });
  });

  it('resets to asc on different column', () => {
    const { result } = renderHook(() => useSort());
    act(() => result.current.onSort('name'));
    act(() => result.current.onSort('name'));
    act(() => result.current.onSort('date'));
    expect(result.current.sort).toEqual({ sortBy: 'date', sortDirection: 'asc' });
  });
});

describe('useDataGridState', () => {
  it('combines pagination and sort state', () => {
    const { result } = renderHook(() => useDataGridState());
    expect(result.current.pagination).toBeDefined();
    expect(result.current.sort).toBeDefined();
    expect(result.current.goToPage).toBeDefined();
    expect(result.current.setPageSize).toBeDefined();
    expect(result.current.onSort).toBeDefined();
  });
});
