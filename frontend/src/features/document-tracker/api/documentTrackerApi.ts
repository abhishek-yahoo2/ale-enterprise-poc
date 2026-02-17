import apiClient from '@/lib/api/client';
import type {
  DocumentTracker,
  DocumentDetails,
  SearchResponse,
  SearchRequest,
} from '@/types/api';

export const documentTrackerApi = {
  search: async (request: SearchRequest): Promise<SearchResponse<DocumentTracker>> => {
    const { data } = await apiClient.post('/api/document-tracker/search', request);
    return data;
  },

  getDetails: async (genId: string): Promise<DocumentDetails> => {
    const { data } = await apiClient.get(`/api/document-tracker/${genId}/details`);
    return data;
  },

  export: async (request: SearchRequest): Promise<Blob> => {
    const { data } = await apiClient.post('/api/document-tracker/export', request, {
      responseType: 'blob',
    });
    return data;
  },
};
