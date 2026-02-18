import { jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/lib/api/client';

// Mock the capitalCallMock module before importing capitalCallApi
jest.unstable_mockModule('../../mocks/capitalCallMock', () => ({
  capitalCallMockApi: {
    search: jest.fn().mockResolvedValue({ data: { data: [], pagination: {} } }),
    getCounts: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

// Dynamic import after mock setup (required for ESM mocking)
const { capitalCallApi } = await import('../capitalCallApi');

describe('capitalCallApi', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('getDetails', () => {
    it('fetches capital call details by id', async () => {
      const mockDetail = { id: 1, aleBatchId: 'BATCH-001', totalAmount: 100000 };
      mock.onGet('/api/capital-call/1').reply(200, mockDetail);

      const result = await capitalCallApi.getDetails(1);
      expect(result).toEqual(mockDetail);
    });
  });

  describe('getLockStatus', () => {
    it('fetches lock status', async () => {
      const lockInfo = { isLocked: false, lockedBy: null };
      mock.onGet('/api/capital-call/1/lock-status').reply(200, lockInfo);

      const result = await capitalCallApi.getLockStatus(1);
      expect(result).toEqual(lockInfo);
    });
  });

  describe('submit', () => {
    it('submits capital call for approval', async () => {
      const submitted = { id: 1, workflowStatus: 'SUBMITTED' };
      mock.onPost('/api/capital-call/1/submit').reply(200, submitted);

      const result = await capitalCallApi.submit(1);
      expect(result).toEqual(submitted);
    });
  });

  describe('approve', () => {
    it('approves capital call', async () => {
      const approved = { id: 1, workflowStatus: 'APPROVED' };
      mock.onPost('/api/capital-call/1/approve').reply(200, approved);

      const result = await capitalCallApi.approve(1);
      expect(result).toEqual(approved);
    });
  });

  describe('reject', () => {
    it('rejects capital call with reason', async () => {
      const rejected = { id: 1, workflowStatus: 'REJECTED' };
      mock.onPost('/api/capital-call/1/reject').reply(200, rejected);

      const result = await capitalCallApi.reject(1, 'Invalid amounts');
      expect(result).toEqual(rejected);
      expect(JSON.parse(mock.history.post[0].data)).toEqual({ reason: 'Invalid amounts' });
    });
  });

  describe('unlock', () => {
    it('force unlocks capital call', async () => {
      mock.onPost('/api/capital-call/1/unlock').reply(200);

      await expect(capitalCallApi.unlock(1)).resolves.toBeUndefined();
    });
  });

  describe('export', () => {
    it('exports search results', async () => {
      const blobData = new Blob(['data']);
      mock.onPost('/api/capital-call/export').reply(200, blobData);

      const result = await capitalCallApi.export({});
      expect(result).toBeDefined();
    });
  });
});
