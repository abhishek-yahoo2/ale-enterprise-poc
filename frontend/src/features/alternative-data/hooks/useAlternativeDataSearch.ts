import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
// import { alternativeDataApi } from '../api/alternativeDataApi';
import { alternativeDataApi } from '../api/alternativeMockDataApi';
import type { SearchRequest, SortRequest, SaveColumnPreferenceRequest } from '../types';
import { toast } from 'sonner';

export const useAlternativeDataSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchRequest>({
    filters: {},
    pagination: { page: 0, size: 25 },
    sort:  {field:'id',direction:'ASC'},
  });

  const query = useQuery({
    queryKey: ['alternative-data', searchParams],
    queryFn: () => alternativeDataApi.search(searchParams),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleSearch = (filters: Record<string, any>) => {
    setSearchParams((prev: SearchRequest) => ({
      ...prev,
      filters,
      pagination: { ...prev.pagination, page: 0 }
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
      sort:  {field,direction},
    }));
  };

  const handleReset = () => {
    setSearchParams({
      filters: {},
      pagination: { page: 0, size: 25 },
      sort:  {field:'id',direction:'ASC'},
    });
  };
console.log('DIDID',query.data)
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

export const useColumnPreferences = () => {
  return useQuery({
    queryKey: ['column-preferences'],
    queryFn: () => alternativeDataApi.getColumnPreferences(),
  });
};

export const useSaveColumnPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SaveColumnPreferenceRequest) =>
      alternativeDataApi.saveColumnPreferences(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['column-preferences'] });
      toast.success('Column preferences saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save column preferences');
    },
  });
};

export const useAlternativeDataExport = () => {
  return useMutation({
    mutationFn: (request: SearchRequest) => alternativeDataApi.export(request),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alternative-data_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Export completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export alternative data');
    },
  });
};
