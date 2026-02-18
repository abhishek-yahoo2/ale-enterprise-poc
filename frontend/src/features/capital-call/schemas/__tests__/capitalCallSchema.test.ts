import { capitalCallSchema } from '../capitalCallSchema';

describe('capitalCallSchema', () => {
  describe('totalAmount', () => {
    it('accepts positive amount', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 100000,
        breakdown: [],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      // breakdown empty array passes the percentage refine (0 <= 100)
      // and the amount refine (0 <= positive check value)
      expect(result.success).toBe(true);
    });

    it('rejects zero amount', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 0,
        breakdown: [],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative amount', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: -100,
        breakdown: [],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('breakdown', () => {
    it('rejects empty name', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [{ name: '', amount: 1000, percentage: 10 }],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative amount in breakdown', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [{ name: 'Test', amount: -100, percentage: 10 }],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects percentage over 100', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [{ name: 'Test', amount: 1000, percentage: 101 }],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative percentage', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [{ name: 'Test', amount: 1000, percentage: -1 }],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects total percentage over 100', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [
          { name: 'A', amount: 1000, percentage: 60 },
          { name: 'B', amount: 1000, percentage: 50 },
        ],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(false);
    });

    it('accepts empty breakdown array', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-01-02'),
        },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('dateRange', () => {
    it('rejects date range exceeding 365 days', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2025-06-01'),
        },
      });
      expect(result.success).toBe(false);
    });

    it('allows date range within 365 days', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [],
        dateRange: {
          fromDate: new Date('2024-01-01'),
          toDate: new Date('2024-06-01'),
        },
      });
      expect(result.success).toBe(true);
    });

    it('allows single day range', () => {
      const date = new Date('2024-06-15');
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [],
        dateRange: { fromDate: date, toDate: date },
      });
      expect(result.success).toBe(true);
    });

    it('requires valid Date objects', () => {
      const result = capitalCallSchema.safeParse({
        totalAmount: 10000,
        breakdown: [],
        dateRange: { fromDate: 'invalid', toDate: 'invalid' },
      });
      expect(result.success).toBe(false);
    });
  });
});
