import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { documentTrackerApi } from '../api/documentTrackerApi';
import type { DocumentDetails, SearchRequest } from '@/types/api';

export const useDocumentSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchRequest>({
    filters: {},
    pagination: { page: 0, size: 25 },
    sort: [],
  });

  const query = useQuery({
    queryKey: ['documents', searchParams],
    queryFn: () => documentTrackerApi.search(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleSearch = (filters: Record<string, any>) => {
    setSearchParams((prev: SearchRequest) => ({
      ...prev,
      filters,
      pagination: { ...prev.pagination, page: 0 },
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev: SearchRequest) => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  };

  const handleSort = (field: string, direction: 'ASC' | 'DESC') => {
    setSearchParams((prev: SearchRequest) => ({
      ...prev,
      sort: [{ field, direction }],
    }));
  };

  const handleReset = () => {
    setSearchParams({
      filters: {},
      pagination: { page: 0, size: 25 },
      sort: [],
    });
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    searchParams,
    handleSearch,
    handlePageChange,
    handleSort,
    handleReset,
    refetch: query.refetch,
  };
};

export const useDocumentDetails = (genId: string) => {
  return useQuery({
    queryKey: ['document-details', genId],
    queryFn: () => documentTrackerApi.getDetails(genId),
    enabled: !!genId,
  });
};

export const useDocumentExport = () => {
  return useMutation({
    mutationFn: (request: SearchRequest) => documentTrackerApi.export(request),
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
};
