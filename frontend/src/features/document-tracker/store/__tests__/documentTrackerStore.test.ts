import { useDocumentTrackerStore } from '../documentTrackerStore';

describe('documentTrackerStore', () => {
  beforeEach(() => {
    useDocumentTrackerStore.setState({
      filters: {},
      selectedDocument: null,
    });
  });

  it('has correct initial state', () => {
    const state = useDocumentTrackerStore.getState();
    expect(state.filters).toEqual({});
    expect(state.selectedDocument).toBeNull();
  });

  describe('setFilters', () => {
    it('sets filters', () => {
      useDocumentTrackerStore.getState().setFilters({ genId: 'GEN001' });
      expect(useDocumentTrackerStore.getState().filters).toEqual({ genId: 'GEN001' });
    });

    it('replaces all filters', () => {
      useDocumentTrackerStore.getState().setFilters({ genId: 'GEN001' });
      useDocumentTrackerStore.getState().setFilters({ documentType: 'PDF' });
      expect(useDocumentTrackerStore.getState().filters).toEqual({ documentType: 'PDF' });
    });
  });

  describe('resetFilters', () => {
    it('resets filters to empty', () => {
      useDocumentTrackerStore.getState().setFilters({ genId: 'GEN001', documentType: 'PDF' });
      useDocumentTrackerStore.getState().resetFilters();
      expect(useDocumentTrackerStore.getState().filters).toEqual({});
    });
  });

  describe('setSelectedDocument', () => {
    it('sets selected document', () => {
      const doc = { id: 1, genId: 'GEN001' };
      useDocumentTrackerStore.getState().setSelectedDocument(doc);
      expect(useDocumentTrackerStore.getState().selectedDocument).toEqual(doc);
    });

    it('clears selected document', () => {
      useDocumentTrackerStore.getState().setSelectedDocument({ id: 1 });
      useDocumentTrackerStore.getState().setSelectedDocument(null);
      expect(useDocumentTrackerStore.getState().selectedDocument).toBeNull();
    });
  });
});
