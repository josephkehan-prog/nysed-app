import { describe, it, expect } from 'vitest';
import { scoreItem } from './score';
import type { ResponseDeclaration } from './types';

describe('scoreItem — match_correct', () => {
  describe('single cardinality', () => {
    const decl: ResponseDeclaration = { cardinality: 'single', correctResponse: ['B'] };

    it('awards full marks for the correct choice', () => {
      expect(scoreItem(decl, 'B')).toEqual({ score: 1, maxScore: 1 });
    });
    it('awards zero for a wrong choice', () => {
      expect(scoreItem(decl, 'A')).toEqual({ score: 0, maxScore: 1 });
    });
    it('accepts a single-element array as the response', () => {
      expect(scoreItem(decl, ['B'])).toEqual({ score: 1, maxScore: 1 });
    });
    it('scores zero for null/undefined/empty response', () => {
      expect(scoreItem(decl, null)).toEqual({ score: 0, maxScore: 1 });
      expect(scoreItem(decl, undefined)).toEqual({ score: 0, maxScore: 1 });
      expect(scoreItem(decl, [])).toEqual({ score: 0, maxScore: 1 });
    });
    it('honors a custom maxScore', () => {
      expect(scoreItem({ ...decl, maxScore: 2 }, 'B')).toEqual({ score: 2, maxScore: 2 });
    });
  });

  describe('multiple cardinality (order-independent set match)', () => {
    const decl: ResponseDeclaration = { cardinality: 'multiple', correctResponse: ['A', 'C'] };

    it('awards full marks when the set matches regardless of order', () => {
      expect(scoreItem(decl, ['C', 'A'])).toEqual({ score: 1, maxScore: 1 });
    });
    it('ignores duplicate selections', () => {
      expect(scoreItem(decl, ['A', 'C', 'A'])).toEqual({ score: 1, maxScore: 1 });
    });
    it('awards zero for a partial selection (no partial credit without mapping)', () => {
      expect(scoreItem(decl, ['A'])).toEqual({ score: 0, maxScore: 1 });
    });
    it('awards zero for an over-selection', () => {
      expect(scoreItem(decl, ['A', 'C', 'D'])).toEqual({ score: 0, maxScore: 1 });
    });
  });

  describe('ordered cardinality (sequence matters)', () => {
    const decl: ResponseDeclaration = { cardinality: 'ordered', correctResponse: ['1', '2', '3'] };

    it('awards full marks for the exact sequence', () => {
      expect(scoreItem(decl, ['1', '2', '3'])).toEqual({ score: 1, maxScore: 1 });
    });
    it('awards zero when the order differs', () => {
      expect(scoreItem(decl, ['1', '3', '2'])).toEqual({ score: 0, maxScore: 1 });
    });
    it('awards zero when length differs', () => {
      expect(scoreItem(decl, ['1', '2'])).toEqual({ score: 0, maxScore: 1 });
    });
  });
});

describe('scoreItem — map_response (partial credit)', () => {
  const decl: ResponseDeclaration = {
    cardinality: 'multiple',
    correctResponse: ['A', 'B'],
    mapping: {
      entries: [
        { key: 'A', value: 1 },
        { key: 'B', value: 1 },
        { key: 'C', value: -1 },
      ],
      defaultValue: 0,
      lowerBound: 0,
    },
  };

  it('sums mapped values for each selected response', () => {
    expect(scoreItem(decl, ['A', 'B'])).toEqual({ score: 2, maxScore: 2 });
  });
  it('gives partial credit for a single correct selection', () => {
    expect(scoreItem(decl, ['A'])).toEqual({ score: 1, maxScore: 2 });
  });
  it('applies negative mappings and clamps to lowerBound', () => {
    expect(scoreItem(decl, ['C'])).toEqual({ score: 0, maxScore: 2 });
  });
  it('uses defaultValue for unmapped selections', () => {
    expect(scoreItem(decl, ['A', 'Z'])).toEqual({ score: 1, maxScore: 2 });
  });
  it('counts each distinct value once', () => {
    expect(scoreItem(decl, ['A', 'A'])).toEqual({ score: 1, maxScore: 2 });
  });
  it('clamps the total to upperBound when provided', () => {
    const capped: ResponseDeclaration = {
      cardinality: 'multiple',
      correctResponse: ['A', 'B'],
      mapping: { entries: [{ key: 'A', value: 1 }, { key: 'B', value: 1 }], upperBound: 1 },
    };
    expect(scoreItem(capped, ['A', 'B'])).toEqual({ score: 1, maxScore: 1 });
  });
  it('scores zero (not negative) for an empty response with lowerBound 0', () => {
    expect(scoreItem(decl, [])).toEqual({ score: 0, maxScore: 2 });
  });
  it('uses a non-zero defaultValue for unmapped values', () => {
    const d: ResponseDeclaration = {
      cardinality: 'multiple',
      correctResponse: ['A'],
      mapping: { entries: [{ key: 'A', value: 2 }], defaultValue: 0.5 },
    };
    expect(scoreItem(d, ['A', 'Q'])).toEqual({ score: 2.5, maxScore: 2 });
  });
});

describe('scoreItem — input validation', () => {
  it('throws on an unknown cardinality', () => {
    const bad = { cardinality: 'weird', correctResponse: ['A'] } as unknown as ResponseDeclaration;
    expect(() => scoreItem(bad, 'A')).toThrow(/cardinality/i);
  });
});
