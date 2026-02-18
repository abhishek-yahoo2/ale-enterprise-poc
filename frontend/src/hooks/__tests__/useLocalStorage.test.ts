import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when key exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('sets value in state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('handles object values', () => {
    const { result } = renderHook(() => useLocalStorage('obj-key', { a: 1 }));

    act(() => {
      result.current[1]({ a: 2, b: 3 });
    });

    expect(result.current[0]).toEqual({ a: 2, b: 3 });
  });

  it('handles array values', () => {
    const { result } = renderHook(() => useLocalStorage('arr-key', [1, 2]));

    act(() => {
      result.current[1]([3, 4, 5]);
    });

    expect(result.current[0]).toEqual([3, 4, 5]);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('bad-key', 'not-json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation((() => {}) as any);

    const { result } = renderHook(() => useLocalStorage('bad-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');

    consoleSpy.mockRestore();
  });
});
