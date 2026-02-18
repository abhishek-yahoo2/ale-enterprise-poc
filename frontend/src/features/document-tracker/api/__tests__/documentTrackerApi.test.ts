import { jest } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/lib/api/client';
import { documentTrackerApi } from '../documentTrackerApi';

describe('documentTrackerApi', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('search', () => {
    it('posts search request and returns data', async () => {
      const mockResponse = {
        data: [{ id: 1, genId: 'GEN001' }],
        pagination: { currentPage: 0, pageSize: 10, totalElements: 1, totalPages: 1 },
      };
      mock.onPost('/api/document-tracker/search').reply(200, mockResponse);

      const result = await documentTrackerApi.search({
        filters: {},
        pagination: { page: 0, size: 10 },
      });

      expect(result).toEqual(mockResponse);
    });

    it('sends correct request body', async () => {
      mock.onPost('/api/document-tracker/search').reply(200, { data: [] });

      const request = {
        filters: { genId: 'GEN001' },
        pagination: { page: 0, size: 10 },
        sort: [{ field: 'createdAt', direction: 'DESC' as const }],
      };
      await documentTrackerApi.search(request);

      expect(JSON.parse(mock.history.post[0].data)).toEqual(request);
    });
  });

  describe('getDetails', () => {
    it('fetches document details by genId', async () => {
      const mockDetails = {
        genId: 'GEN001',
        documentType: 'PDF',
        subDocuments: [],
      };
      mock.onGet('/api/document-tracker/GEN001/details').reply(200, mockDetails);

      const result = await documentTrackerApi.getDetails('GEN001');
      expect(result).toEqual(mockDetails);
    });
  });

  describe('export', () => {
    it('posts export request and returns blob', async () => {
      const blobData = new Blob(['csv-data']);
      mock.onPost('/api/document-tracker/export').reply(200, blobData);

      const result = await documentTrackerApi.export({
        filters: {},
        pagination: { page: 0, size: 10 },
      });
      expect(result).toBeDefined();
    });
  });
});
