import { renderHook, act } from '@testing-library/react';
import usePagination from '../usePagination';

describe('usePagination', () => {
  it('calculates total pages correctly', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );
    expect(result.current.totalPages).toBe(10);
  });

  it('rounds up total pages', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 101, itemsPerPage: 10 })
    );
    expect(result.current.totalPages).toBe(11);
  });

  it('defaults to page 1', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, itemsPerPage: 10 })
    );
    expect(result.current.currentPage).toBe(1);
  });

  it('uses initialPage when provided', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, itemsPerPage: 10, initialPage: 3 })
    );
    expect(result.current.currentPage).toBe(3);
  });

  it('generates correct page numbers', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 30, itemsPerPage: 10 })
    );
    expect(result.current.pageNumbers).toEqual([1, 2, 3]);
  });

  it('changes page within valid range', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, itemsPerPage: 10 })
    );

    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.currentPage).toBe(3);
  });

  it('does not change page below 1', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, itemsPerPage: 10 })
    );

    act(() => {
      result.current.setCurrentPage(0);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('does not change page above totalPages', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, itemsPerPage: 10 })
    );

    act(() => {
      result.current.setCurrentPage(6);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('handles single page', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 5, itemsPerPage: 10 })
    );
    expect(result.current.totalPages).toBe(1);
    expect(result.current.pageNumbers).toEqual([1]);
  });

  it('handles zero items', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 0, itemsPerPage: 10 })
    );
    expect(result.current.totalPages).toBe(0);
    expect(result.current.pageNumbers).toEqual([]);
  });
});
