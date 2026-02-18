import { documentTrackerFilterSchema, advancedSearchSchema } from '../filterSchema';

describe('documentTrackerFilterSchema', () => {
  it('validates empty object', () => {
    const result = documentTrackerFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates valid genId format', () => {
    const result = documentTrackerFilterSchema.safeParse({ genId: 'GEN123' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid genId format', () => {
    const result = documentTrackerFilterSchema.safeParse({ genId: 'INVALID' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Gen ID must be in format GEN followed by numbers');
    }
  });

  it('allows optional genId as empty string (fails refine)', () => {
    const result = documentTrackerFilterSchema.safeParse({ genId: '' });
    // Empty string is falsy so the refine returns true (skips check)
    expect(result.success).toBe(true);
  });

  it('validates optional documentType', () => {
    const result = documentTrackerFilterSchema.safeParse({ documentType: 'PDF' });
    expect(result.success).toBe(true);
  });

  it('validates valid date strings', () => {
    const result = documentTrackerFilterSchema.safeParse({
      fromDate: '2024-01-01',
      toDate: '2024-12-31',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid fromDate', () => {
    const result = documentTrackerFilterSchema.safeParse({ fromDate: 'not-a-date' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid toDate', () => {
    const result = documentTrackerFilterSchema.safeParse({ toDate: 'not-a-date' });
    expect(result.success).toBe(false);
  });

  it('rejects fromDate after toDate', () => {
    const result = documentTrackerFilterSchema.safeParse({
      fromDate: '2024-12-31',
      toDate: '2024-01-01',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('From Date must be before or equal to To Date');
    }
  });

  it('allows fromDate equal to toDate', () => {
    const result = documentTrackerFilterSchema.safeParse({
      fromDate: '2024-06-15',
      toDate: '2024-06-15',
    });
    expect(result.success).toBe(true);
  });

  it('allows only fromDate without toDate', () => {
    const result = documentTrackerFilterSchema.safeParse({ fromDate: '2024-01-01' });
    expect(result.success).toBe(true);
  });
});

describe('advancedSearchSchema', () => {
  it('validates empty object', () => {
    const result = advancedSearchSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates valid status values', () => {
    const statuses = ['PROCESS_FAILED', 'PROCESS_COMPLETED', 'IN_PROGRESS', ''];
    statuses.forEach((status) => {
      const result = advancedSearchSchema.safeParse({ status });
      expect(result.success).toBe(true);
    });
  });

  it('rejects invalid status', () => {
    const result = advancedSearchSchema.safeParse({ status: 'INVALID_STATUS' });
    expect(result.success).toBe(false);
  });

  it('validates valid severity values', () => {
    const severities = ['ERROR', 'SUCCESS', 'WARNING', 'INFO', ''];
    severities.forEach((severity) => {
      const result = advancedSearchSchema.safeParse({ severity });
      expect(result.success).toBe(true);
    });
  });

  it('rejects invalid severity', () => {
    const result = advancedSearchSchema.safeParse({ severity: 'CRITICAL' });
    expect(result.success).toBe(false);
  });

  it('validates all fields together', () => {
    const result = advancedSearchSchema.safeParse({
      genId: 'GEN001',
      documentType: 'PDF',
      createdBy: 'admin',
      status: 'IN_PROGRESS',
      fromDate: '2024-01-01',
      toDate: '2024-12-31',
      severity: 'ERROR',
    });
    expect(result.success).toBe(true);
  });

  it('rejects fromDate after toDate', () => {
    const result = advancedSearchSchema.safeParse({
      fromDate: '2024-12-31',
      toDate: '2024-01-01',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('From Date must be before or equal to To Date');
    }
  });
});
