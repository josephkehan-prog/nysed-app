import { describe, it, expect } from 'vitest';
import { aggregateMastery, type Attempt } from './mastery';

const a = (standard: string, score: number, maxScore = 1, moduleId = 'm'): Attempt => ({
  studentId: 's',
  moduleId,
  standard,
  score,
  maxScore,
});

describe('aggregateMastery', () => {
  it('returns an empty list for no attempts', () => {
    expect(aggregateMastery([])).toEqual([]);
  });

  it('sums score and maxScore per standard and computes mastery', () => {
    const rows = aggregateMastery([a('6.RP.A.3', 1), a('6.RP.A.3', 0)]);
    expect(rows).toEqual([
      { standard: '6.RP.A.3', attempts: 2, earned: 1, possible: 2, mastery: 0.5 },
    ]);
  });

  it('groups by standard, sorted ascending', () => {
    const rows = aggregateMastery([a('6.NS.B.4', 1), a('6.EE.A.2', 1), a('6.NS.B.4', 1)]);
    expect(rows.map((r) => r.standard)).toEqual(['6.EE.A.2', '6.NS.B.4']);
    expect(rows.find((r) => r.standard === '6.NS.B.4')).toMatchObject({
      attempts: 2,
      earned: 2,
      possible: 2,
      mastery: 1,
    });
  });

  it('reports mastery 0 (not NaN) when nothing is possible', () => {
    const rows = aggregateMastery([a('6.G.A.1', 0, 0)]);
    expect(rows[0]).toMatchObject({ standard: '6.G.A.1', possible: 0, mastery: 0 });
  });
});
