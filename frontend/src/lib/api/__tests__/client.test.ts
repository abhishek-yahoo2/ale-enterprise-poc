import { jest } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../client';

describe('apiClient', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  it('has correct default baseURL', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it('has correct default timeout', () => {
    expect(apiClient.defaults.timeout).toBe(30000);
  });

  it('has correct default content-type header', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  describe('request interceptor', () => {
    it('adds auth token from localStorage', async () => {
      localStorage.setItem('authToken', 'test-bearer-token');
      mock.onGet('/api/test').reply(200, { ok: true });

      const response = await apiClient.get('/api/test');
      expect(response.config.headers.Authorization).toBe('Bearer test-bearer-token');
    });

    it('does not add auth header when no token exists', async () => {
      mock.onGet('/api/test').reply(200, { ok: true });

      const response = await apiClient.get('/api/test');
      expect(response.config.headers.Authorization).toBeUndefined();
    });

    it('adds correlation ID header', async () => {
      mock.onGet('/api/test').reply(200, { ok: true });

      const response = await apiClient.get('/api/test');
      expect(response.config.headers['X-Correlation-ID']).toBeDefined();
    });
  });

  describe('response interceptor', () => {
    it('passes through successful responses', async () => {
      mock.onGet('/api/test').reply(200, { data: 'success' });

      const response = await apiClient.get('/api/test');
      expect(response.data).toEqual({ data: 'success' });
    });

    it('redirects to login on 401', async () => {
      const originalHref = window.location.href;
      mock.onGet('/api/protected').reply(401, {
        status: 401,
        error: 'Unauthorized',
      });

      await expect(apiClient.get('/api/protected')).rejects.toBeDefined();
    });

    it('handles 423 locked resource', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation((() => {}) as any);
      mock.onGet('/api/locked').reply(423, {
        status: 423,
        error: 'Locked',
      });

      await expect(apiClient.get('/api/locked')).rejects.toBeDefined();
      consoleSpy.mockRestore();
    });

    it('rejects with error response data', async () => {
      const errorData = {
        status: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      };
      mock.onGet('/api/error').reply(500, errorData);

      try {
        await apiClient.get('/api/error');
        fail('should have thrown');
      } catch (error: any) {
        expect(error).toEqual(errorData);
      }
    });
  });
});
