import { describe, it, expect } from 'vitest';
import { createLocalProgressStore, type StorageLike } from './store';
import type { Attempt } from './mastery';

function fakeStorage(): StorageLike & { dump(): Record<string, string> } {
  const map = new Map<string, string>();
  return {
    getItem: (k) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k, v) => void map.set(k, v),
    dump: () => Object.fromEntries(map),
  };
}

const attempt = (over: Partial<Attempt> = {}): Attempt => ({
  studentId: 's1',
  moduleId: 'm1',
  standard: '6.RP.A.3',
  score: 1,
  maxScore: 1,
  ...over,
});

describe('localProgressStore', () => {
  it('records an attempt and reflects it in mastery-by-standard', () => {
    const store = createLocalProgressStore(fakeStorage());
    store.recordAttempt(attempt({ score: 1 }));
    store.recordAttempt(attempt({ score: 0 }));
    expect(store.masteryByStandard('s1')).toEqual([
      { standard: '6.RP.A.3', attempts: 2, earned: 1, possible: 2, mastery: 0.5 },
    ]);
  });

  it('persists across store instances backed by the same storage', () => {
    const storage = fakeStorage();
    createLocalProgressStore(storage).recordAttempt(attempt());
    // A fresh store (e.g. after a page reload) sees the prior attempt.
    expect(createLocalProgressStore(storage).masteryByStandard('s1')).toHaveLength(1);
  });

  it('isolates students from one another', () => {
    const store = createLocalProgressStore(fakeStorage());
    store.recordAttempt(attempt({ studentId: 's1' }));
    store.recordAttempt(attempt({ studentId: 's2', standard: '6.NS.B.4' }));
    expect(store.masteryByStandard('s1').map((r) => r.standard)).toEqual(['6.RP.A.3']);
    expect(store.masteryByStandard('s2').map((r) => r.standard)).toEqual(['6.NS.B.4']);
  });

  it('tracks engaged modules from both attempts and visits, per student', () => {
    const store = createLocalProgressStore(fakeStorage());
    store.recordAttempt(attempt({ studentId: 's1', moduleId: 'practice-1' }));
    store.markVisited('s1', 'explore-1');
    store.markVisited('s1', 'explore-1'); // idempotent
    store.markVisited('s2', 'explore-9');
    expect(store.engagedModuleIds('s1')).toEqual(new Set(['practice-1', 'explore-1']));
    expect(store.engagedModuleIds('s2')).toEqual(new Set(['explore-9']));
  });

  it('returns empty results for corrupt storage instead of throwing', () => {
    const storage = fakeStorage();
    storage.setItem('nysed:progress:v1', '{not json');
    const store = createLocalProgressStore(storage);
    expect(store.masteryByStandard('s1')).toEqual([]);
    expect(store.engagedModuleIds('s1')).toEqual(new Set());
  });
});
