import { describe, it, expect } from 'vitest';
import { buildPracticeSession, buildReviewSession } from './session';
import type { LearningModule } from './types';
import type { StandardMastery } from '../progress/mastery';

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

const mastery = (standard: string, m: number): StandardMastery => ({
  standard,
  attempts: 4,
  earned: m * 4,
  possible: 4,
  mastery: m,
});

// Module whose primary standard is `standard` (cluster derived for the helper).
const sMod = (id: string, standard: string): LearningModule => ({
  meta: {
    id,
    domain: 'math',
    cluster: standard.split('.').slice(0, 2).join('.'),
    standards: [standard],
    title: id,
    kind: 'practice',
    source: { name: 's', license: 'l', attribution: 'a' },
  },
  items: [{ stem: 's', interactionType: 'numeric', answer: { type: 'numeric', value: 1 } }],
});

describe('buildReviewSession', () => {
  it('prioritizes unattempted, then weakest standards, deterministically', () => {
    const modules = [
      sMod('strong', '6.RP.A.1'),
      sMod('weak', '6.NS.B.3'),
      sMod('unseen', '6.EE.A.2'),
    ];
    const m = [mastery('6.RP.A.1', 1), mastery('6.NS.B.3', 0.25)]; // 6.EE.A.2 unattempted
    expect(buildReviewSession(modules, m, 2).map((x) => x.meta.id)).toEqual(['unseen', 'weak']);
  });

  it('only includes auto-scorable practice modules', () => {
    const explore: LearningModule = { ...sMod('e', '6.G.A.1'), items: [{ stem: 's', interactionType: 'text' }] };
    expect(buildReviewSession([explore], []).length).toBe(0);
  });
});
