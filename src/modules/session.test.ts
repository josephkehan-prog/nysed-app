import { describe, it, expect } from 'vitest';
import { buildPracticeSession } from './session';
import type { LearningModule } from './types';

const mod = (id: string, cluster: string, scorable: boolean): LearningModule => ({
  meta: {
    id,
    domain: 'math',
    cluster,
    standards: [`${cluster}.A.1`],
    title: id,
    kind: scorable ? 'practice' : 'explore',
    source: { name: 's', license: 'l', attribution: 'a' },
  },
  items: [
    scorable
      ? { stem: 's', interactionType: 'numeric', answer: { type: 'numeric', value: 1 } }
      : { stem: 's', interactionType: 'text', workedSolution: 'w' },
  ],
});

describe('buildPracticeSession', () => {
  it('keeps only auto-scorable (practice) modules', () => {
    const s = buildPracticeSession([mod('a', '6.RP', true), mod('b', '6.NS', false)]);
    expect(s.map((m) => m.meta.id)).toEqual(['a']);
  });

  it('orders by cluster then id and caps at size', () => {
    const s = buildPracticeSession(
      [mod('z', '6.NS', true), mod('a', '6.NS', true), mod('m', '6.EE', true)],
      2,
    );
    expect(s.map((m) => m.meta.id)).toEqual(['m', 'a']); // 6.EE before 6.NS; within 6.NS a<z; capped to 2
  });

  it('returns empty when nothing is auto-scorable', () => {
    expect(buildPracticeSession([mod('x', '6.G', false)])).toEqual([]);
  });
});
