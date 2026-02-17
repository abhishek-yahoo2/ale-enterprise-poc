import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AlternativeDataFilters {
  clientName?: string;
  accountNumber?: string;
  fundFamily?: string;
  status?: string;
  fromDate?: Date;
  toDate?: Date;
}

interface AlternativeDataState {
  filters: AlternativeDataFilters;
  selectedViewName: string;
  setFilters: (filters: AlternativeDataFilters) => void;
  setSelectedViewName: (viewName: string) => void;
  resetFilters: () => void;
}

export const useAlternativeDataStore = create<AlternativeDataState>()(
  persist(
    (set) => ({
      filters: {},
      selectedViewName: 'default',
      setFilters: (filters) => set({ filters }),
      setSelectedViewName: (viewName) => set({ selectedViewName: viewName }),
      resetFilters: () => set({ filters: {} }),
    }),
    {
      name: 'alternative-data-filters',
      partialize: (state) => ({ filters: state.filters, selectedViewName: state.selectedViewName }),
    }
  )
);
