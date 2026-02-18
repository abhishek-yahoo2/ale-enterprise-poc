import { jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import usePermissions from '../usePermissions';

describe('usePermissions', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches permissions for a user', async () => {
    const mockPermissions = ['READ', 'WRITE', 'DELETE'];
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ permissions: mockPermissions }),
    } as any) as any;

    const { result } = renderHook(() => usePermissions({ userId: 'user-1' }));

    await waitFor(() => {
      expect(result.current.permissions).toEqual(mockPermissions);
    });
  });

  it('hasPermission returns true for granted permission', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ permissions: ['READ', 'WRITE'] }),
    } as any) as any;

    const { result } = renderHook(() => usePermissions({ userId: 'user-1' }));

    await waitFor(() => {
      expect(result.current.hasPermission('READ')).toBe(true);
    });
  });

  it('hasPermission returns false for denied permission', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ permissions: ['READ'] }),
    } as any) as any;

    const { result } = renderHook(() => usePermissions({ userId: 'user-1' }));

    await waitFor(() => {
      expect(result.current.permissions.length).toBeGreaterThan(0);
    });
    expect(result.current.hasPermission('DELETE')).toBe(false);
  });

  it('handles fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation((() => {}) as any);
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error')) as any;

    const { result } = renderHook(() => usePermissions({ userId: 'user-1' }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    expect(result.current.permissions).toEqual([]);

    consoleSpy.mockRestore();
  });

  it('starts with empty permissions', () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ permissions: [] }),
    } as any) as any;

    const { result } = renderHook(() => usePermissions({ userId: 'user-1' }));
    expect(result.current.permissions).toEqual([]);
  });
});
