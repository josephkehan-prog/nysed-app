import { describe, it, expect } from 'vitest';
import { mathEquivalent, scoreResponse } from './score';
import type { PracticeItem } from './types';

describe('mathEquivalent — Compute Engine', () => {
  it('treats a fraction and its decimal as equal', () => {
    expect(mathEquivalent('\\frac{1}{2}', '0.5')).toBe(true);
    expect(mathEquivalent('1/4 + 1/4', '0.5')).toBe(true);
  });

  it('treats commuted / expanded forms as equal', () => {
    expect(mathEquivalent('2x+3', '3+2x')).toBe(true);
    expect(mathEquivalent('(x+1)^2', 'x^2+2x+1')).toBe(true);
  });

  it('rejects unequal expressions', () => {
    expect(mathEquivalent('\\frac{1}{2}', '\\frac{1}{3}')).toBe(false);
    expect(mathEquivalent('2x', 'x')).toBe(false);
  });

  it('never throws on malformed input', () => {
    expect(mathEquivalent('x +', 'x')).toBe(false);
  });
});

function item(partial: Partial<PracticeItem>): PracticeItem {
  return { stem: 's', interactionType: 'numeric', ...partial } as PracticeItem;
}

describe('scoreResponse', () => {
  it('scores a numeric answer within tolerance', () => {
    const it1 = item({ interactionType: 'numeric', answer: { type: 'numeric', value: 40 } });
    expect(scoreResponse(it1, { type: 'numeric', value: 40 })).toEqual({ score: 1, maxScore: 1 });
    expect(scoreResponse(it1, { type: 'numeric', value: 41 })).toEqual({ score: 0, maxScore: 1 });

    const it2 = item({ answer: { type: 'numeric', value: 3.14, tolerance: 0.01 } });
    expect(scoreResponse(it2, { type: 'numeric', value: 3.145 })?.score).toBe(1);
  });

  it('scores a math answer by equivalence', () => {
    const m = item({ interactionType: 'math', answer: { type: 'math', expected: '1/2' } });
    expect(scoreResponse(m, { type: 'math', latex: '0.5' })?.score).toBe(1);
    expect(scoreResponse(m, { type: 'math', latex: '1/3' })?.score).toBe(0);
  });

  it('scores single and multiple choice', () => {
    const single = item({ interactionType: 'choice', answer: { type: 'choice', correct: ['b'] } });
    expect(scoreResponse(single, { type: 'choice', selected: ['b'] })?.score).toBe(1);
    expect(scoreResponse(single, { type: 'choice', selected: ['a'] })?.score).toBe(0);

    const multi = item({ interactionType: 'choice', answer: { type: 'choice', correct: ['a', 'c'] } });
    expect(scoreResponse(multi, { type: 'choice', selected: ['c', 'a'] })?.score).toBe(1);
    expect(scoreResponse(multi, { type: 'choice', selected: ['a'] })?.score).toBe(0);
  });

  it('scores text case- and whitespace-insensitively', () => {
    const t = item({ interactionType: 'text', answer: { type: 'text', accept: ['Pythagorean'] } });
    expect(scoreResponse(t, { type: 'text', text: '  pythagorean ' })?.score).toBe(1);
    expect(scoreResponse(t, { type: 'text', text: 'wrong' })?.score).toBe(0);
  });

  it('scores a number-line answer via the checker, within tolerance', () => {
    const nl = item({
      interactionType: 'numberline',
      answer: { type: 'numberline', value: 3, tolerance: 0.5 },
    });
    expect(scoreResponse(nl, { type: 'numberline', value: 3.4 })?.score).toBe(1);
    expect(scoreResponse(nl, { type: 'numberline', value: 4 })?.score).toBe(0);
  });

  it('scores an ordering answer by sequence', () => {
    const o = item({ interactionType: 'order', answer: { type: 'order', correctOrder: ['a', 'b', 'c'] } });
    expect(scoreResponse(o, { type: 'order', ordered: ['a', 'b', 'c'] })?.score).toBe(1);
    expect(scoreResponse(o, { type: 'order', ordered: ['b', 'a', 'c'] })?.score).toBe(0);
  });

  it('returns null for an explore item (no answer)', () => {
    const e = item({ interactionType: 'text', workedSolution: 'see solution' });
    expect(scoreResponse(e, { type: 'text', text: 'anything' })).toBeNull();
  });

  it('scores 0 when the response type does not match the answer', () => {
    const n = item({ answer: { type: 'numeric', value: 5 } });
    expect(scoreResponse(n, { type: 'text', text: '5' })).toEqual({ score: 0, maxScore: 1 });
  });
});
