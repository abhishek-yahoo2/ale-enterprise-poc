import { useCapitalCallStore } from '../capitalCallStore';

describe('capitalCallStore', () => {
  beforeEach(() => {
    useCapitalCallStore.setState({
      activeTab: 'FOR_REVIEW',
      activeSubTab: 'SSI_VERIFICATION_NEEDED',
      selectedQueue: 'Operator Queue',
      filters: {},
      currentPage: 0,
      pageSize: 100,
      sortField: null,
      sortDirection: 'ASC',
    });
  });

  it('has correct initial state', () => {
    const state = useCapitalCallStore.getState();
    expect(state.activeTab).toBe('FOR_REVIEW');
    expect(state.activeSubTab).toBe('SSI_VERIFICATION_NEEDED');
    expect(state.selectedQueue).toBe('Operator Queue');
    expect(state.filters).toEqual({});
    expect(state.currentPage).toBe(0);
    expect(state.pageSize).toBe(100);
    expect(state.sortField).toBeNull();
    expect(state.sortDirection).toBe('ASC');
  });

  describe('setActiveTab', () => {
    it('sets active tab', () => {
      useCapitalCallStore.getState().setActiveTab('COMPLETED');
      expect(useCapitalCallStore.getState().activeTab).toBe('COMPLETED');
    });
  });

  describe('setActiveSubTab', () => {
    it('sets active sub-tab', () => {
      useCapitalCallStore.getState().setActiveSubTab('PENDING_APPROVAL');
      expect(useCapitalCallStore.getState().activeSubTab).toBe('PENDING_APPROVAL');
    });
  });

  describe('setSelectedQueue', () => {
    it('sets selected queue', () => {
      useCapitalCallStore.getState().setSelectedQueue('Manager Queue');
      expect(useCapitalCallStore.getState().selectedQueue).toBe('Manager Queue');
    });
  });

  describe('setFilters', () => {
    it('sets filters and resets page', () => {
      useCapitalCallStore.getState().setPage(5);
      useCapitalCallStore.getState().setFilters({ clientName: 'Test' });
      expect(useCapitalCallStore.getState().filters).toEqual({ clientName: 'Test' });
      expect(useCapitalCallStore.getState().currentPage).toBe(0);
    });
  });

  describe('updateFilter', () => {
    it('updates a single filter field', () => {
      useCapitalCallStore.getState().setFilters({ clientName: 'Test' });
      useCapitalCallStore.getState().updateFilter('clientName', 'Updated');
      expect(useCapitalCallStore.getState().filters.clientName).toBe('Updated');
    });

    it('resets page on filter update', () => {
      useCapitalCallStore.getState().setPage(3);
      useCapitalCallStore.getState().updateFilter('clientName', 'Test');
      expect(useCapitalCallStore.getState().currentPage).toBe(0);
    });
  });

  describe('resetFilters', () => {
    it('resets filters and page', () => {
      useCapitalCallStore.getState().setFilters({ clientName: 'Test' });
      useCapitalCallStore.getState().setPage(5);
      useCapitalCallStore.getState().resetFilters();
      expect(useCapitalCallStore.getState().filters).toEqual({});
      expect(useCapitalCallStore.getState().currentPage).toBe(0);
    });
  });

  describe('setPage', () => {
    it('sets current page', () => {
      useCapitalCallStore.getState().setPage(3);
      expect(useCapitalCallStore.getState().currentPage).toBe(3);
    });
  });

  describe('setSort', () => {
    it('sets sort field and direction', () => {
      useCapitalCallStore.getState().setSort('totalAmount', 'DESC');
      expect(useCapitalCallStore.getState().sortField).toBe('totalAmount');
      expect(useCapitalCallStore.getState().sortDirection).toBe('DESC');
    });
  });
});
