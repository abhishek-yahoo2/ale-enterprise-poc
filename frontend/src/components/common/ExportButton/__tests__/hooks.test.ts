import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useExportData } from '../hooks';

describe('useExportData', () => {
  it('initializes with isLoading false and no error', () => {
    const { result } = renderHook(() => useExportData());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exports JSON data', async () => {
    const { result } = renderHook(() => useExportData());
    const clickSpy = jest.fn();
    jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
      set setAttribute(_args: any) {},
    } as any);

    await act(async () => {
      await result.current.exportData([{ a: 1 }], 'test', 'json');
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('exports CSV data', async () => {
    const { result } = renderHook(() => useExportData());
    await act(async () => {
      await result.current.exportData([{ name: 'test', value: 1 }], 'export', 'csv');
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles empty array for CSV', async () => {
    const { result } = renderHook(() => useExportData());
    await act(async () => {
      await result.current.exportData([], 'export', 'csv');
    });
    expect(result.current.isLoading).toBe(false);
  });
});
