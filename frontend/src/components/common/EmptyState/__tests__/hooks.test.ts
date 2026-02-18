import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useEmptyState } from '../hooks';

describe('useEmptyState', () => {
  const initialConfig = { title: 'No Data', description: 'Nothing here' };

  it('returns initial config and isVisible true', () => {
    const { result } = renderHook(() => useEmptyState(initialConfig));
    expect(result.current.config).toEqual(initialConfig);
    expect(result.current.isVisible).toBe(true);
  });

  it('updateConfig merges partial config', () => {
    const { result } = renderHook(() => useEmptyState(initialConfig));
    act(() => result.current.updateConfig({ description: 'Updated' }));
    expect(result.current.config.title).toBe('No Data');
    expect(result.current.config.description).toBe('Updated');
  });

  it('hide sets isVisible to false', () => {
    const { result } = renderHook(() => useEmptyState(initialConfig));
    act(() => result.current.hide());
    expect(result.current.isVisible).toBe(false);
  });

  it('show sets isVisible to true', () => {
    const { result } = renderHook(() => useEmptyState(initialConfig));
    act(() => result.current.hide());
    act(() => result.current.show());
    expect(result.current.isVisible).toBe(true);
  });

  it('reset restores initial config and shows', () => {
    const { result } = renderHook(() => useEmptyState(initialConfig));
    act(() => result.current.updateConfig({ title: 'Changed' }));
    act(() => result.current.hide());
    act(() => result.current.reset());
    expect(result.current.config).toEqual(initialConfig);
    expect(result.current.isVisible).toBe(true);
  });
});
