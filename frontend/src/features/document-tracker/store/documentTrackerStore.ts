import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DocumentTrackerFilters {
  genId?: string;
  documentType?: string;
  fromDate?: Date;
  toDate?: Date;
}

interface DocumentTrackerState {
  filters: DocumentTrackerFilters;
  selectedDocument: any | null;
  setFilters: (filters: DocumentTrackerFilters) => void;
  resetFilters: () => void;
  setSelectedDocument: (doc: any | null) => void;
}

export const useDocumentTrackerStore = create<DocumentTrackerState>()(
  persist(
    (set) => ({
      filters: {},
      selectedDocument: null,
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: {} }),
      setSelectedDocument: (doc) => set({ selectedDocument: doc }),
    }),
    {
      name: 'document-tracker-filters',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
