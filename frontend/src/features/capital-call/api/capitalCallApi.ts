/**
 * COPILOT: API client for Capital Call operations
 * 
 * Endpoints to implement:
 * - POST /api/capital-call/search - Search with filters
 * - GET /api/capital-call/{id} - Get details
 * - POST /api/capital-call/{id}/submit - Submit for approval
 * - POST /api/capital-call/{id}/approve - Approve
 * - POST /api/capital-call/{id}/reject - Reject with reason
 * - POST /api/capital-call/{id}/unlock - Force unlock
 * - GET /api/capital-call/counts - Get tab and sub-tab counts
 * 
 * Use axios instance from your existing api client
 */

import { apiClient } from '@/lib/api/client'; // Your existing axios instance
import type { 
  CapitalCall, 
  CapitalCallSearchFilters,
  SubTabCount,
  LockInfo
} from '../types';
import type { PaginatedResponse, SearchRequest } from '@/types/common';
import { capitalCallMockApi } from '../mocks/capitalCallMock';

export const capitalCallApi = {
  /**
   * Search capital calls with filters, pagination, and sorting
   * POST /api/capital-call/search
   */
  search: async (
    filters: CapitalCallSearchFilters,
    page: number,
    size: number,
    sortField: string | null,
    sortDirection: 'ASC' | 'DESC'
  ): Promise<PaginatedResponse<CapitalCall>> => {
    const request: SearchRequest<CapitalCallSearchFilters> = {
      filters,
      pagination: { page, size },
      sort: sortField ? [{ field: sortField, direction: sortDirection }] : []
    };
    //call mock API for now
    const { data } = await capitalCallMockApi.search(filters, page, size, sortField, sortDirection);
    // const { data } = await apiClient.post('/api/capital-call/search', request);
    return data;
  },

  /**
   * Get capital call details by ID
   * GET /api/capital-call/{id}
   */
  getDetails: async (id: number): Promise<CapitalCall> => {
    const { data } = await apiClient.get(`/api/capital-call/${id}`);
    return data;
  },

  /**
   * Get document counts for tabs and sub-tabs
   * GET /api/capital-call/counts?queue={queue}
   */
  getCounts: async (queue: string): Promise<SubTabCount[]> => {
    // const { data } = await apiClient.get('/api/capital-call/counts', {
    //   params: { queue }
    // });
    //get counts from mock for now
    const { data } = await capitalCallMockApi.getCounts(queue);
    return data;
  },

  /**
   * Check lock status for a capital call
   * GET /api/capital-call/{id}/lock-status
   */
  getLockStatus: async (id: number): Promise<LockInfo> => {
    const { data } = await apiClient.get(`/api/capital-call/${id}/lock-status`);
    return data;
  },

  /**
   * Submit capital call for approval
   * POST /api/capital-call/{id}/submit
   */
  submit: async (id: number): Promise<CapitalCall> => {
    const { data } = await apiClient.post(`/api/capital-call/${id}/submit`);
    return data;
  },

  /**
   * Approve capital call
   * POST /api/capital-call/{id}/approve
   */
  approve: async (id: number): Promise<CapitalCall> => {
    const { data } = await apiClient.post(`/api/capital-call/${id}/approve`);
    return data;
  },

  /**
   * Reject capital call with reason
   * POST /api/capital-call/{id}/reject
   */
  reject: async (id: number, reason: string): Promise<CapitalCall> => {
    const { data } = await apiClient.post(`/api/capital-call/${id}/reject`, { reason });
    return data;
  },

  /**
   * Force unlock capital call
   * POST /api/capital-call/{id}/unlock
   */
  unlock: async (id: number): Promise<void> => {
    await apiClient.post(`/api/capital-call/${id}/unlock`);
  },

  /**
   * Export search results to Excel
   * POST /api/capital-call/export
   */
  export: async (filters: CapitalCallSearchFilters): Promise<Blob> => {
    const request: SearchRequest<CapitalCallSearchFilters> = {
      filters,
      pagination: { page: 0, size: 10000 }, // Export all
      sort: []
    };
    
    const { data } = await apiClient.post('/api/capital-call/export', request, {
      responseType: 'blob'
    });
    return data;
  }
};