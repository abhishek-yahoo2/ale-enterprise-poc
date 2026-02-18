import { jest } from '@jest/globals';
import { capitalCallMock } from '../../mocks/capitalCallMock';

const { useCapitalCall } = await import('../useCapitalCall');

describe('useCapitalCall', () => {
  it('returns getByStatus and search functions', () => {
    const hook = useCapitalCall();
    expect(typeof hook.getByStatus).toBe('function');
    expect(typeof hook.search).toBe('function');
  });

  it('getByStatus filters mock data by status', () => {
    const hook = useCapitalCall();
    const results = hook.getByStatus('DRAFT');
    results.forEach((item: any) => {
      expect(item.status).toBe('DRAFT');
    });
  });

  it('search returns data', () => {
    const hook = useCapitalCall();
    const results = hook.search({});
    expect(results).toBeDefined();
  });
});
