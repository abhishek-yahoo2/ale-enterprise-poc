import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useLoading, useLoadingWithTimeout, useAsyncLoading } from '../hooks';

describe('useLoading', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useLoading());
    expect(result.current.isLoading).toBe(false);
  });

  it('accepts initial state true', () => {
    const { result } = renderHook(() => useLoading(true));
    expect(result.current.isLoading).toBe(true);
  });

  it('startLoading sets true', () => {
    const { result } = renderHook(() => useLoading());
    act(() => result.current.startLoading());
    expect(result.current.isLoading).toBe(true);
  });

  it('stopLoading sets false', () => {
    const { result } = renderHook(() => useLoading(true));
    act(() => result.current.stopLoading());
    expect(result.current.isLoading).toBe(false);
  });

  it('toggleLoading flips state', () => {
    const { result } = renderHook(() => useLoading());
    act(() => result.current.toggleLoading());
    expect(result.current.isLoading).toBe(true);
    act(() => result.current.toggleLoading());
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useLoadingWithTimeout', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('startLoading sets true', () => {
    const { result } = renderHook(() => useLoadingWithTimeout());
    act(() => result.current.startLoading());
    expect(result.current.isLoading).toBe(true);
  });

  it('stopLoading sets false', () => {
    const { result } = renderHook(() => useLoadingWithTimeout(true));
    act(() => result.current.stopLoading());
    expect(result.current.isLoading).toBe(false);
  });

  it('startLoadingWithTimeout auto-stops after timeout', () => {
    const { result } = renderHook(() => useLoadingWithTimeout(false, 1000));
    act(() => { result.current.startLoadingWithTimeout(); });
    expect(result.current.isLoading).toBe(true);
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.isLoading).toBe(false);
  });

  it('cleanup cancels the timer', () => {
    const { result } = renderHook(() => useLoadingWithTimeout(false, 1000));
    let cleanup: (() => void) | undefined;
    act(() => { cleanup = result.current.startLoadingWithTimeout(); });
    cleanup?.();
    act(() => jest.advanceTimersByTime(1000));
    expect(result.current.isLoading).toBe(true);
  });
});

describe('useAsyncLoading', () => {
  it('starts not loading with no error', () => {
    const { result } = renderHook(() => useAsyncLoading());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('executes successfully and returns result', async () => {
    const { result } = renderHook(() => useAsyncLoading());
    let value: string | null = null;
    await act(async () => {
      value = await result.current.execute(() => Promise.resolve('ok'));
    });
    expect(value).toBe('ok');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles Error on failure', async () => {
    const { result } = renderHook(() => useAsyncLoading());
    let value: unknown = 'not-null';
    await act(async () => {
      value = await result.current.execute(() => Promise.reject(new Error('boom')));
    });
    expect(value).toBeNull();
    expect(result.current.error?.message).toBe('boom');
  });

  it('handles non-Error on failure', async () => {
    const { result } = renderHook(() => useAsyncLoading());
    await act(async () => {
      await result.current.execute(() => Promise.reject('string err'));
    });
    expect(result.current.error?.message).toBe('string err');
  });
});
