import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { capitalCallApi } from '../api/capitalCallApi';
import type { SearchRequest, CreateCapitalCallRequest, UpdateCapitalCallRequest } from '@/types/api';
import { toast } from 'sonner';
import { useCapitalCallStore } from '../store/capitalCallStore';


export const useCapitalCallSearch = () => {
//   const [searchParams, setSearchParams] = useState<SearchRequest>({
//     filters: {},
//     pagination: { page: 0, size: 25 },
//     sort: [],
//   });
// Get state from Zustand store
  const filters = useCapitalCallStore((state) => state.filters);
  const currentPage = useCapitalCallStore((state) => state.currentPage);
  const pageSize = useCapitalCallStore((state) => state.pageSize);
  const sortField = useCapitalCallStore((state) => state.sortField);
  const sortDirection = useCapitalCallStore((state) => state.sortDirection);
  const activeTab = useCapitalCallStore((state) => state.activeTab);
  const activeSubTab = useCapitalCallStore((state) => state.activeSubTab);
  const setFilters = useCapitalCallStore((state) => state.setFilters);
  const setSearchParams = useCapitalCallStore((state) => state.setSearchParams);
  const query = useQuery({
    queryKey: ['capital-calls', filters, currentPage, pageSize, sortField, sortDirection],
    queryFn: () => capitalCallApi.search(filters, currentPage, pageSize, sortField, sortDirection),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleSearch = (filters: Record<string, any>) => {
    setFilters(filters);
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
    searchParams: {
      filters,
      pagination: { page: currentPage, size: pageSize },
      sort: sortField ? [{ field: sortField, direction: sortDirection }] : [],
    },
    handleSearch,
    handlePageChange,
    handleSort,
    handleReset,
    refetch: query.refetch,
  };
};

export const useCapitalCallDetails = (id: number | null) => {
  return useQuery({
    queryKey: ['capital-call-details', id],
    queryFn: () => capitalCallApi.getDetails(id!),
    enabled: !!id,
  });
};

export const useCreateCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCapitalCallRequest) => capitalCallApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create capital call');
    },
  });
};

export const useUpdateCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateCapitalCallRequest }) =>
      capitalCallApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update capital call');
    },
  });
};

export const useSubmitCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.submit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit capital call');
    },
  });
};

export const useApproveCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve capital call');
    },
  });
};

export const useRejectCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject capital call');
    },
  });
};

export const useUnlockCapitalCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => capitalCallApi.unlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-calls'] });
      toast.success('Capital call unlocked successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unlock capital call');
    },
  });
};

export const useCapitalCallExport = () => {
  return useMutation({
    mutationFn: (request: SearchRequest) => capitalCallApi.export(request),
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `capital-calls_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Export completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export capital calls');
    },
  });
};
