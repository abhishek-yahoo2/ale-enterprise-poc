import { useAlternativeDataStore } from '../alternativeDataStore';

describe('alternativeDataStore', () => {
  beforeEach(() => {
    useAlternativeDataStore.setState({
      filters: {},
      selectedViewName: 'default',
    });
  });

  it('has correct initial state', () => {
    const state = useAlternativeDataStore.getState();
    expect(state.filters).toEqual({});
    expect(state.selectedViewName).toBe('default');
  });

  describe('setFilters', () => {
    it('sets filters', () => {
      useAlternativeDataStore.getState().setFilters({ clientName: 'BlackRock' });
      expect(useAlternativeDataStore.getState().filters).toEqual({ clientName: 'BlackRock' });
    });

    it('replaces all filters', () => {
      useAlternativeDataStore.getState().setFilters({ clientName: 'BlackRock' });
      useAlternativeDataStore.getState().setFilters({ status: 'Active' });
      expect(useAlternativeDataStore.getState().filters).toEqual({ status: 'Active' });
    });
  });

  describe('setSelectedViewName', () => {
    it('sets view name', () => {
      useAlternativeDataStore.getState().setSelectedViewName('custom-view');
      expect(useAlternativeDataStore.getState().selectedViewName).toBe('custom-view');
    });
  });

  describe('resetFilters', () => {
    it('resets filters to empty', () => {
      useAlternativeDataStore.getState().setFilters({ clientName: 'Test', status: 'Active' });
      useAlternativeDataStore.getState().resetFilters();
      expect(useAlternativeDataStore.getState().filters).toEqual({});
    });

    it('does not reset selectedViewName', () => {
      useAlternativeDataStore.getState().setSelectedViewName('custom');
      useAlternativeDataStore.getState().resetFilters();
      expect(useAlternativeDataStore.getState().selectedViewName).toBe('custom');
    });
  });
});
