import { describe, it, expect } from 'vitest';
import { visibleSections } from './sections';

describe('visibleSections — content panels per subject', () => {
  it('math shows graphing, equation entry, and calculator', () => {
    const s = visibleSections('math');
    expect(s.graphing).toBe(true);
    expect(s.equationEntry).toBe(true);
    expect(s.calculator).toBe(true);
  });

  it('ELA hides the math-only panels', () => {
    const s = visibleSections('ela');
    expect(s.graphing).toBe(false);
    expect(s.equationEntry).toBe(false);
    expect(s.calculator).toBe(false);
  });

  it('writing space and scratch paper are available in both subjects', () => {
    for (const subject of ['math', 'ela'] as const) {
      const s = visibleSections(subject);
      expect(s.writingSpace).toBe(true);
      expect(s.scratchPaper).toBe(true);
    }
  });
});
