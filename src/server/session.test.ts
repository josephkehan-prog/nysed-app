import { describe, it, expect } from 'vitest';
import { buildPracticeSession } from './session';

const items = [
  { id: 'a', standard: '4.OA.A.1' },
  { id: 'b', standard: '4.OA.A.1' },
  { id: 'c', standard: '4.NBT.B.4' },
  { id: 'd', standard: '4.OA.A.1' },
];

describe('buildPracticeSession', () => {
  it('returns only items for the requested standard', () => {
    const s = buildPracticeSession(items, '4.OA.A.1', 10);
    expect(s.map((i) => i.id)).toEqual(['a', 'b', 'd']);
  });

  it('caps the session at count', () => {
    expect(buildPracticeSession(items, '4.OA.A.1', 2).map((i) => i.id)).toEqual(['a', 'b']);
  });

  it('returns empty for an unknown standard', () => {
    expect(buildPracticeSession(items, 'X', 5)).toEqual([]);
  });

  it('returns empty for non-positive count', () => {
    expect(buildPracticeSession(items, '4.OA.A.1', 0)).toEqual([]);
  });
});
