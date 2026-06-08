import { describe, it, expect } from 'vitest';
import { availableTools } from './tools';

describe('availableTools — NYSED Nextera gating', () => {
  it('Grade 4 math never has a calculator (either session)', () => {
    expect(availableTools(4, 1).calculator).toBeNull();
    expect(availableTools(4, 2).calculator).toBeNull();
  });

  it('Grade 6 math has a four-function+sqrt calculator only in Session 2', () => {
    expect(availableTools(6, 1).calculator).toBeNull();
    expect(availableTools(6, 2).calculator).toEqual({ type: 'four-function-sqrt' });
  });

  it('reference sheet is grades 5-8: Grade 4 no, Grade 6 yes', () => {
    expect(availableTools(4, 2).referenceSheet).toBe(false);
    expect(availableTools(6, 2).referenceSheet).toBe(true);
  });

  it('protractor is available for grades 4-8 (math)', () => {
    expect(availableTools(4, 1).protractor).toBe(true);
    expect(availableTools(6, 1).protractor).toBe(true);
  });

  it('drawing tool and equation editor are Session 2 only (math)', () => {
    const s1 = availableTools(6, 1);
    const s2 = availableTools(6, 2);
    expect(s1.drawingTool).toBe(false);
    expect(s1.equationEditor).toBe(false);
    expect(s2.drawingTool).toBe(true);
    expect(s2.equationEditor).toBe(true);
  });

  it('always-on tools are present regardless of grade/session', () => {
    const t = availableTools(4, 1);
    expect(
      t.zoom &&
        t.bookmark &&
        t.notepad &&
        t.highlighter &&
        t.answerEliminator &&
        t.lineReader &&
        t.colorChoices,
    ).toBe(true);
  });

  it('ELA omits math-only tools', () => {
    const t = availableTools(6, 2, 'ela');
    expect(t.calculator).toBeNull();
    expect(t.ruler).toBe(false);
    expect(t.protractor).toBe(false);
    expect(t.referenceSheet).toBe(false);
    expect(t.highlighter).toBe(true);
  });
});
