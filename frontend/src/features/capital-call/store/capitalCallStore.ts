/**
 * COPILOT: Zustand store for Capital Call state management
 * 
 * Requirements from user stories:
 * - US 2.2: Filters persist across tab switches
 * - Filters retained when switching between main tabs
 * - Filters retained when switching between sub-tabs
 * - Current tab and sub-tab remembered
 * 
 * State to persist:
 * - Active main tab
 * - Active sub-tab (for FOR_REVIEW)
 * - All filter values
 * - Selected queue (Operator Queue dropdown)
 * 
 * Use localStorage persistence so filters survive page reload
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CapitalCallSearchFilters, CapitalCallTab, ForReviewSubTab } from '../types';
import type { SearchRequest } from '@/types/api';

interface CapitalCallState {
  // Active tabs
  activeTab: CapitalCallTab;
  activeSubTab: ForReviewSubTab;
  selectedQueue: string;
  
  // Filter state
  filters: CapitalCallSearchFilters;
  
  // Pagination state
  currentPage: number;
  pageSize: number;
  
  // Sort state
  sortField: string | null;
  sortDirection: 'ASC' | 'DESC';
  
  // Actions
  setActiveTab: (tab: CapitalCallTab) => void;
  setActiveSubTab: (subTab: ForReviewSubTab) => void;
  setSelectedQueue: (queue: string) => void;
  setFilters: (filters: CapitalCallSearchFilters) => void;
  updateFilter: (key: keyof CapitalCallSearchFilters, value: any) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setSort: (field: string, direction: 'ASC' | 'DESC') => void;
}

export const useCapitalCallStore = create<CapitalCallState>()(
  persist(
    (set) => ({
      // Default state
      activeTab: 'FOR_REVIEW' as CapitalCallTab,
      activeSubTab: 'SSI_VERIFICATION_NEEDED' as ForReviewSubTab,
      selectedQueue: 'Operator Queue',
      filters: {},
      currentPage: 0,
      pageSize: 100, // From UI: "1 to 100 of 2573"
      sortField: null,
      sortDirection: 'ASC',
      
      // Set active main tab - filters persist
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Set active sub-tab - filters persist
      setActiveSubTab: (subTab) => set({ activeSubTab: subTab }),
      
      // Set selected queue
      setSelectedQueue: (queue) => set({ selectedQueue: queue }),
      
      // Replace all filters
      setFilters: (filters) => set({ filters, currentPage: 0 }),
      
      // Update single filter field
      updateFilter: (key, value) => set((state) => ({
        filters: {
          ...state.filters,
          [key]: value
        },
        currentPage: 0 // Reset to first page on filter change
      })),
      
      // Update search parameters (from API response)   
      setSearchParams: (params:SearchRequest) => set((state) => ({
        filters: params.filters,
        currentPage: params.pagination.page,
        pageSize: params.pagination.size,
        sortField: params.sort?.[0]?.field || null,
        sortDirection: params.sort?.[0]?.direction || 'ASC'
        })),
      // Reset all filters to empty
      resetFilters: () => set({ 
        filters: {},
        currentPage: 0 
      }),
      
      // Pagination
      setPage: (page) => set({ currentPage: page }),
      
      // Sorting
      setSort: (field, direction) => set({ 
        sortField: field,
        sortDirection: direction 
      })
    }),
    {
      name: 'capital-call-state', // localStorage key
      // Only persist these fields
      partialize: (state) => ({
        activeTab: state.activeTab,
        activeSubTab: state.activeSubTab,
        selectedQueue: state.selectedQueue,
        filters: state.filters,
        sortField: state.sortField,
        sortDirection: state.sortDirection
      })
    }
  )
);