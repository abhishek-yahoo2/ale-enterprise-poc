import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import useAuth from '../useAuth';

describe('useAuth', () => {
  const apiEndpoint = 'http://localhost:8080/api';

  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('starts unauthenticated with no stored user', () => {
    const { result } = renderHook(() => useAuth({ apiEndpoint }));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('loads user from localStorage on mount', () => {
    const storedUser = { id: '1', username: 'admin' };
    localStorage.setItem('user', JSON.stringify(storedUser));

    const { result } = renderHook(() => useAuth({ apiEndpoint }));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(storedUser);
  });

  it('logs in successfully', async () => {
    const mockUser = { id: '1', username: 'admin' };
    const mockToken = 'test-token-123';

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: mockToken }),
    } as any) as any;

    const { result } = renderHook(() => useAuth({ apiEndpoint }));

    await act(async () => {
      await result.current.login('admin', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(localStorage.getItem('authToken')).toBe(mockToken);
  });

  it('throws on login failure', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as any) as any;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation((() => {}) as any);
    const { result } = renderHook(() => useAuth({ apiEndpoint }));

    await expect(
      act(async () => {
        await result.current.login('wrong', 'credentials');
      })
    ).rejects.toThrow('Login failed');

    expect(result.current.isAuthenticated).toBe(false);
    consoleSpy.mockRestore();
  });

  it('logs out and clears storage', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1' }));
    localStorage.setItem('authToken', 'token');

    const { result } = renderHook(() => useAuth({ apiEndpoint }));

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('calls correct API endpoint for login', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: '1' }, token: 'tok' }),
    } as any) as any;

    const { result } = renderHook(() => useAuth({ apiEndpoint }));

    await act(async () => {
      await result.current.login('user', 'pass');
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${apiEndpoint}/login`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'user', password: 'pass' }),
      })
    );
  });
});
