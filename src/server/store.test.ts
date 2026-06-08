import { describe, it, expect } from 'vitest';
import { createStore } from './store';

describe('store — attempts & mastery', () => {
  it('records attempts and computes per-standard mastery', () => {
    const store = createStore();
    store.recordAttempt({ studentId: 's1', itemId: 'i1', standard: '4.OA.A.1', score: 1, maxScore: 1 });
    store.recordAttempt({ studentId: 's1', itemId: 'i2', standard: '4.OA.A.1', score: 0, maxScore: 1 });
    store.recordAttempt({ studentId: 's1', itemId: 'i3', standard: '4.NBT.B.4', score: 2, maxScore: 2 });

    const mastery = store.masteryByStandard('s1');
    const oa = mastery.find((m) => m.standard === '4.OA.A.1')!;
    expect(oa.attempts).toBe(2);
    expect(oa.earned).toBe(1);
    expect(oa.possible).toBe(2);
    expect(oa.mastery).toBe(0.5);

    const nbt = mastery.find((m) => m.standard === '4.NBT.B.4')!;
    expect(nbt.mastery).toBe(1);
    store.close();
  });

  it('isolates mastery by student', () => {
    const store = createStore();
    store.recordAttempt({ studentId: 's1', itemId: 'i1', standard: 'X', score: 1, maxScore: 1 });
    store.recordAttempt({ studentId: 's2', itemId: 'i1', standard: 'X', score: 0, maxScore: 1 });
    expect(store.masteryByStandard('s2')[0].mastery).toBe(0);
    expect(store.masteryByStandard('s1')[0].mastery).toBe(1);
    store.close();
  });

  it('records and counts dispute flags', () => {
    const store = createStore();
    store.flagItem('i9', 'wrong key', 's1');
    store.flagItem('i9', 'ambiguous');
    expect(store.flagCount('i9')).toBe(2);
    expect(store.flagCount('iX')).toBe(0);
    store.close();
  });
});
