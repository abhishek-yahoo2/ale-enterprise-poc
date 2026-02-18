import { alternativeDataApi } from '../alternativeDataApi';

describe('alternativeDataApi', () => {
  describe('search', () => {
    it('returns paginated results', async () => {
      const result = await alternativeDataApi.search({
        page: 0,
        size: 10,
      });

      expect(result.content).toBeDefined();
      expect(result.totalElements).toBeGreaterThan(0);
      expect(result.content.length).toBeLessThanOrEqual(10);
    });

    it('filters by client name', async () => {
      const result = await alternativeDataApi.search({
        filters: { client: 'BlackRock' },
        page: 0,
        size: 100,
      });

      result.content.forEach((record: any) => {
        expect(record.client).toBe('BlackRock');
      });
    });

    it('filters by status', async () => {
      const result = await alternativeDataApi.search({
        filters: { status: 'Active' },
        page: 0,
        size: 100,
      });

      result.content.forEach((record: any) => {
        expect(record.status).toBe('Active');
      });
    });

    it('filters by search keyword', async () => {
      const result = await alternativeDataApi.search({
        filters: { search: 'asset' },
        page: 0,
        size: 100,
      });

      result.content.forEach((record: any) => {
        const matchesDescription = record.assetDescription.toLowerCase().includes('asset');
        const matchesAccount = record.account.toLowerCase().includes('asset');
        expect(matchesDescription || matchesAccount).toBe(true);
      });
    });

    it('handles sorting', async () => {
      const result = await alternativeDataApi.search({
        sort: { field: 'amount', direction: 'DESC' },
        page: 0,
        size: 10,
      });

      expect(result.content.length).toBeGreaterThan(0);
    });

    it('handles pagination', async () => {
      const page0 = await alternativeDataApi.search({ page: 0, size: 5 });
      const page1 = await alternativeDataApi.search({ page: 1, size: 5 });

      expect(page0.page).toBe(0);
      expect(page1.page).toBe(1);
      expect(page0.content[0].id).not.toBe(page1.content[0].id);
    });
  });

  describe('getColumnPreferences', () => {
    it('returns column preferences', async () => {
      const result = await alternativeDataApi.getColumnPreferences();
      expect(result.columns).toBeDefined();
      expect(Array.isArray(result.columns)).toBe(true);
    });
  });

  describe('saveColumnPreferences', () => {
    it('saves and returns updated preferences', async () => {
      const columns = ['id', 'client', 'status'];
      const result = await alternativeDataApi.saveColumnPreferences({ columns });
      expect(result.columns).toEqual(columns);
    });

    it('enforces max 40 columns', async () => {
      const columns = Array.from({ length: 50 }, (_, i) => `col-${i}`);
      const result = await alternativeDataApi.saveColumnPreferences({ columns });
      expect(result.columns.length).toBeLessThanOrEqual(40);
    });
  });

  describe('export', () => {
    it('returns a CSV blob', async () => {
      const result = await alternativeDataApi.export();
      expect(result).toBeInstanceOf(Blob);
    });
  });
});
