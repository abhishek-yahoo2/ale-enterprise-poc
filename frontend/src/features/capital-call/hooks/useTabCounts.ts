/**
 * COPILOT: Hook to fetch document counts for tab cards
 * 
 * Shows counts like:
 * - SSI Verification Needed: 2573
 * - Transaction To Be Processed: 17
 * - etc.
 * 
 * Refetch every 30 seconds to keep counts fresh
 */

import { useQuery } from '@tanstack/react-query';
import { capitalCallApi } from '../api/capitalCallApi';
import { useCapitalCallStore } from '../store/capitalCallStore';

export const useTabCounts = () => {
  const selectedQueue = useCapitalCallStore((state) => state.selectedQueue);
  
  return useQuery({
    queryKey: ['capital-call-counts', selectedQueue],
    queryFn: () => capitalCallApi.getCounts(selectedQueue),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
};