import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler, useAsyncError, useSafeAsync } from '../hooks';

describe('useErrorHandler', () => {
  it('starts with no error', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('setError sets error and hasError', () => {
    const { result } = renderHook(() => useErrorHandler());
    const err = new Error('test');
    act(() => result.current.setError(err));
    expect(result.current.error).toBe(err);
    expect(result.current.hasError).toBe(true);
  });

  it('setError with null clears error', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => result.current.setError(new Error('x')));
    act(() => result.current.setError(null));
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('clearError resets state', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => result.current.setError(new Error('x')));
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });
});

describe('useAsyncError', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useAsyncError());
    expect(typeof result.current).toBe('function');
  });
});

describe('useSafeAsync', () => {
  it('executes callback successfully', async () => {
    const callback = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const { result } = renderHook(() => useSafeAsync(callback as any));
    expect(result.current.loading).toBe(false);
    await act(async () => { await result.current.execute(); });
    expect(callback).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('handles Error on failure', async () => {
    const callback = jest.fn<() => Promise<void>>().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useSafeAsync(callback as any));
    await act(async () => { await result.current.execute(); });
    expect(result.current.loading).toBe(false);
  });

  it('handles non-Error on failure', async () => {
    const callback = jest.fn<() => Promise<void>>().mockRejectedValue('string error');
    const { result } = renderHook(() => useSafeAsync(callback as any));
    await act(async () => { await result.current.execute(); });
    expect(result.current.loading).toBe(false);
  });
});
