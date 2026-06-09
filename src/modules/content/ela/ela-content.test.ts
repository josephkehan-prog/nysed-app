import { describe, it, expect } from 'vitest';
import { loadModules } from '../../registry';
import { scoreResponse } from '../../score';
import type { AnswerSpec } from '../../types';

describe('ELA reading content', () => {
  it('provides reading modules with passages, grouped under RL/RI clusters', async () => {
    const modules = await loadModules('ela');
    expect(modules.length).toBeGreaterThanOrEqual(2);
    const clusters = new Set(modules.map((m) => m.meta.cluster));
    expect([...clusters]).toEqual(expect.arrayContaining(['6.RL', '6.RI']));
    expect(modules.every((m) => typeof m.passage === 'string' && m.passage.length > 0)).toBe(true);
  });

  it('every ELA practice key scores itself full and a blank response zero', async () => {
    const modules = await loadModules('ela');
    const items = modules.flatMap((m) => m.items.filter((i) => i.answer));
    expect(items.length).toBeGreaterThan(3);
    for (const item of items) {
      const answer = item.answer as AnswerSpec;
      if (answer.type !== 'choice') continue; // ELA items are choice / multi-select
      const right = scoreResponse(item, { type: 'choice', selected: answer.correct });
      const wrong = scoreResponse(item, { type: 'choice', selected: [] });
      expect(right!.score).toBe(right!.maxScore);
      expect(wrong!.score).toBe(0);
    }
  });
});
