import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../hooks';

describe('usePagination', () => {
  it('has defaults', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(1);
  });

  it('accepts custom props', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 2, pageSize: 20, totalItems: 100 })
    );
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.totalPages).toBe(5);
  });

  it('goToPage clamps to valid range', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, pageSize: 10 })
    );
    act(() => result.current.goToPage(10));
    expect(result.current.currentPage).toBe(5);
    act(() => result.current.goToPage(0));
    expect(result.current.currentPage).toBe(1);
  });

  it('nextPage increments', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, pageSize: 10 })
    );
    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2);
  });

  it('prevPage decrements', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 3, totalItems: 50, pageSize: 10 })
    );
    act(() => result.current.prevPage());
    expect(result.current.currentPage).toBe(2);
  });

  it('prevPage does not go below 1', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 1, totalItems: 50, pageSize: 10 })
    );
    act(() => result.current.prevPage());
    expect(result.current.currentPage).toBe(1);
  });

  it('setPageSize resets to page 1 and enforces min 1', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 3, totalItems: 100, pageSize: 10 })
    );
    act(() => result.current.setPageSize(25));
    expect(result.current.pageSize).toBe(25);
    expect(result.current.currentPage).toBe(1);
    act(() => result.current.setPageSize(0));
    expect(result.current.pageSize).toBe(1);
  });
});
