import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useFilterState, useFilteredData } from '../hooks';

describe('useFilterState', () => {
  it('returns empty filters by default', () => {
    const { result } = renderHook(() => useFilterState());
    expect(result.current.filters).toEqual({});
  });

  it('accepts initial filters', () => {
    const { result } = renderHook(() => useFilterState({ name: 'test' }));
    expect(result.current.filters).toEqual({ name: 'test' });
  });

  it('updateFilter sets a single filter', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => result.current.updateFilter('status', 'active'));
    expect(result.current.filters.status).toBe('active');
  });

  it('clearFilters resets to initial', () => {
    const initial = { type: 'doc' };
    const { result } = renderHook(() => useFilterState(initial));
    act(() => result.current.updateFilter('status', 'active'));
    act(() => result.current.clearFilters());
    expect(result.current.filters).toEqual(initial);
  });

  it('setMultipleFilters merges multiple', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => result.current.setMultipleFilters({ a: '1', b: '2' }));
    expect(result.current.filters).toEqual({ a: '1', b: '2' });
  });
});

describe('useFilteredData', () => {
  it('filters data using the provided function', () => {
    const data = [{ name: 'a', age: 10 }, { name: 'b', age: 20 }];
    const filters = { minAge: 15 };
    const filterFn = (item: any, f: any) => item.age >= f.minAge;
    const { result } = renderHook(() => useFilteredData(data, filters, filterFn));
    expect(result.current).toEqual([{ name: 'b', age: 20 }]);
  });

  it('returns all data when filter matches everything', () => {
    const data = [{ v: 1 }, { v: 2 }];
    const { result } = renderHook(() => useFilteredData(data, {}, () => true));
    expect(result.current).toHaveLength(2);
  });
});
