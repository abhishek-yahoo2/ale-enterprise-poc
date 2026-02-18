import {
  formatCurrency,
  formatDateTime,
  formatDate,
  formatPercentage,
  cn,
  getStatusColor,
  getSeverityIcon,
} from '../formatters';

describe('formatCurrency', () => {
  it.each([
    [0, '$0.00'],
    [1234.5, '$1,234.50'],
    [1000000, '$1,000,000.00'],
    [-500.99, '-$500.99'],
    [0.1, '$0.10'],
    [99999999.99, '$99,999,999.99'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatCurrency(input)).toBe(expected);
  });
});

describe('formatDateTime', () => {
  it('formats a date-time string', () => {
    const result = formatDateTime('2024-01-15T14:30:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('handles ISO date strings', () => {
    const result = formatDateTime('2024-06-01T00:00:00Z');
    expect(result).toContain('2024');
  });
});

describe('formatDate', () => {
  it('formats a date string without time', () => {
    const result = formatDate('2024-03-20T10:00:00Z');
    expect(result).toContain('Mar');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });

  it('handles different months', () => {
    const result = formatDate('2024-12-25T00:00:00Z');
    expect(result).toContain('Dec');
    expect(result).toContain('25');
  });
});

describe('formatPercentage', () => {
  it.each([
    [50, '50.00%'],
    [0, '0.00%'],
    [100, '100.00%'],
    [33.333, '33.33%'],
    [99.999, '100.00%'],
    [0.1, '0.10%'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatPercentage(input)).toBe(expected);
  });
});

describe('cn (formatters version)', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(cn('a', undefined, null, false, 'b')).toBe('a b');
  });

  it('returns empty string for no classes', () => {
    expect(cn()).toBe('');
  });

  it('handles all falsy values', () => {
    expect(cn(undefined, null, false)).toBe('');
  });
});

describe('getStatusColor', () => {
  it.each([
    ['DRAFT', 'bg-gray-100 text-gray-800'],
    ['SUBMITTED', 'bg-blue-100 text-blue-800'],
    ['APPROVED', 'bg-green-100 text-green-800'],
    ['REJECTED', 'bg-red-100 text-red-800'],
    ['PROCESS_COMPLETED', 'bg-green-100 text-green-800'],
    ['PROCESS_FAILED', 'bg-red-100 text-red-800'],
    ['IN_PROGRESS', 'bg-yellow-100 text-yellow-800'],
    ['VALIDATED', 'bg-blue-100 text-blue-800'],
    ['PUBLISHED', 'bg-green-100 text-green-800'],
    ['ARCHIVED', 'bg-gray-600 text-white'],
  ])('returns correct color for %s', (status, expected) => {
    expect(getStatusColor(status)).toBe(expected);
  });

  it('returns default color for unknown status', () => {
    expect(getStatusColor('UNKNOWN')).toBe('bg-gray-100 text-gray-800');
  });
});

describe('getSeverityIcon', () => {
  it.each([
    ['ERROR', '❌'],
    ['SUCCESS', '✅'],
    ['WARNING', '⚠️'],
    ['INFO', 'ℹ️'],
  ])('returns correct icon for %s', (severity, expected) => {
    expect(getSeverityIcon(severity)).toBe(expected);
  });

  it('returns default bullet for unknown severity', () => {
    expect(getSeverityIcon('UNKNOWN')).toBe('•');
  });
});
