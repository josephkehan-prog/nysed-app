import { describe, it, expect } from 'vitest';
import {
  pointsMatch,
  numberLineMatch,
  shadedRegionMatch,
  shadedFractionEquivalent,
  barsMatch,
} from './checkers';

describe('pointsMatch', () => {
  it('matches the same points regardless of order', () => {
    expect(
      pointsMatch(
        [
          { x: 1, y: 2 },
          { x: 3, y: 4 },
        ],
        [
          { x: 3, y: 4 },
          { x: 1, y: 2 },
        ],
      ),
    ).toBe(true);
  });
  it('fails on a wrong point', () => {
    expect(pointsMatch([{ x: 1, y: 2 }], [{ x: 1, y: 3 }])).toBe(false);
  });
  it('fails on different counts', () => {
    expect(
      pointsMatch([{ x: 1, y: 2 }], [
        { x: 1, y: 2 },
        { x: 0, y: 0 },
      ]),
    ).toBe(false);
  });
  it('respects tolerance', () => {
    expect(pointsMatch([{ x: 1.01, y: 2.0 }], [{ x: 1, y: 2 }], 0.05)).toBe(true);
    expect(pointsMatch([{ x: 1.2, y: 2.0 }], [{ x: 1, y: 2 }], 0.05)).toBe(false);
  });
});

describe('numberLineMatch', () => {
  it('matches exactly', () => {
    expect(numberLineMatch(3, 3)).toBe(true);
  });
  it('matches within tolerance', () => {
    expect(numberLineMatch(2.95, 3, 0.1)).toBe(true);
  });
  it('fails outside tolerance', () => {
    expect(numberLineMatch(2.5, 3, 0.1)).toBe(false);
  });
});

describe('shadedRegionMatch', () => {
  it('matches the same shaded set regardless of order', () => {
    expect(shadedRegionMatch([2, 0, 1], [0, 1, 2])).toBe(true);
  });
  it('fails when a different cell is shaded', () => {
    expect(shadedRegionMatch([0, 1], [0, 2])).toBe(false);
  });
  it('fails on different counts', () => {
    expect(shadedRegionMatch([0], [0, 1])).toBe(false);
  });
});

describe('shadedFractionEquivalent', () => {
  it('treats 2/4 as equivalent to 1/2', () => {
    expect(shadedFractionEquivalent(2, 4, 1, 2)).toBe(true);
  });
  it('treats 3/6 as equivalent to 1/2', () => {
    expect(shadedFractionEquivalent(3, 6, 1, 2)).toBe(true);
  });
  it('rejects 1/4 vs 1/2', () => {
    expect(shadedFractionEquivalent(1, 4, 1, 2)).toBe(false);
  });
  it('rejects zero denominators', () => {
    expect(shadedFractionEquivalent(1, 0, 1, 2)).toBe(false);
  });
});

describe('barsMatch', () => {
  it('matches positional values', () => {
    expect(barsMatch([3, 5, 2], [3, 5, 2])).toBe(true);
  });
  it('is position-sensitive', () => {
    expect(barsMatch([5, 3, 2], [3, 5, 2])).toBe(false);
  });
  it('respects tolerance', () => {
    expect(barsMatch([3.05, 5, 2], [3, 5, 2], 0.1)).toBe(true);
  });
  it('fails on length mismatch', () => {
    expect(barsMatch([3, 5], [3, 5, 2])).toBe(false);
  });
});
