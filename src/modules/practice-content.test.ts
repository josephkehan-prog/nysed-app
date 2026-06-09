import { describe, it, expect } from 'vitest';
import { loadModules } from './registry';
import { scoreResponse } from './score';
import type { AnswerSpec, ResponsePayload } from './types';

// Build the response a perfect student would give for a key.
function correctResponse(answer: AnswerSpec): ResponsePayload {
  switch (answer.type) {
    case 'numeric':
      return { type: 'numeric', value: answer.value };
    case 'math':
      return { type: 'math', latex: answer.expected };
    case 'choice':
      return { type: 'choice', selected: answer.correct };
    case 'text':
      return { type: 'text', text: answer.accept[0] };
    case 'order':
      return { type: 'order', ordered: answer.correctOrder };
    case 'numberline':
      return { type: 'numberline', value: answer.value };
  }
}

// Build a response that must be wrong for any well-formed key.
function wrongResponse(answer: AnswerSpec): ResponsePayload {
  switch (answer.type) {
    case 'numeric':
      return { type: 'numeric', value: answer.value + 1000 };
    case 'math':
      return { type: 'math', latex: `(${answer.expected})+1` };
    case 'choice':
      return { type: 'choice', selected: [] };
    case 'text':
      return { type: 'text', text: 'definitely not the answer' };
    case 'order':
      return {
        type: 'order',
        ordered:
          answer.correctOrder.length > 1
            ? [answer.correctOrder[1], answer.correctOrder[0], ...answer.correctOrder.slice(2)]
            : ['definitely-not-the-answer'],
      };
    case 'numberline':
      return { type: 'numberline', value: answer.value + 1000 };
  }
}

describe('Grade 6 math practice content', () => {
  it('covers all five Grade 6 clusters with auto-scored practice items', async () => {
    const modules = await loadModules('math');
    const practiceClusters = new Set(
      modules.filter((m) => m.items.some((i) => i.answer)).map((m) => m.meta.cluster),
    );
    for (const cluster of ['6.RP', '6.NS', '6.EE', '6.G', '6.SP']) {
      expect([...practiceClusters]).toContain(cluster);
    }
  });

  it('scores every practice key correct for itself and wrong otherwise', async () => {
    const modules = await loadModules('math');
    const items = modules.flatMap((m) =>
      m.items.filter((i) => i.answer).map((i) => ({ id: m.meta.id, item: i })),
    );
    expect(items.length).toBeGreaterThan(5);
    for (const { id, item } of items) {
      const answer = item.answer as AnswerSpec;
      const right = scoreResponse(item, correctResponse(answer));
      const wrong = scoreResponse(item, wrongResponse(answer));
      expect(right, `${id}: correct key should score`).not.toBeNull();
      expect(right!.score, `${id}: correct key should earn full marks`).toBe(right!.maxScore);
      expect(wrong!.score, `${id}: a wrong response should earn 0`).toBe(0);
    }
  });
});
