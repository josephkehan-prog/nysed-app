// NYSED Nextera tool-availability gating. Mirrors the on-screen tool palette
// and per-grade/per-session rules from the 2026 Teacher's Directions.

export type Session = 1 | 2;
export type Subject = 'math' | 'ela';

export interface CalculatorInfo {
  /** NYSED Grade 6 allows a four-function calculator with a square-root key. */
  type: 'four-function-sqrt';
}

export interface ToolAvailability {
  zoom: boolean;
  bookmark: boolean;
  notepad: boolean;
  highlighter: boolean;
  answerEliminator: boolean;
  lineReader: boolean;
  colorChoices: boolean;
  drawingTool: boolean;
  equationEditor: boolean;
  ruler: boolean;
  protractor: boolean;
  referenceSheet: boolean;
  /** null when no calculator is permitted for this grade/session/subject. */
  calculator: CalculatorInfo | null;
}

export function availableTools(
  grade: number,
  session: Session,
  subject: Subject = 'math',
): ToolAvailability {
  const isMath = subject === 'math';
  return {
    // Always available, any grade/session/subject.
    zoom: true,
    bookmark: true,
    notepad: true,
    highlighter: true,
    answerEliminator: true,
    lineReader: true,
    colorChoices: true,
    // Math, Session 2 only.
    drawingTool: isMath && session === 2,
    equationEditor: isMath && session === 2,
    // Math tools.
    ruler: isMath,
    protractor: isMath && grade >= 4 && grade <= 8,
    referenceSheet: isMath && grade >= 5 && grade <= 8,
    // Grade 4: never. Grade 6: Session 2 only. Graphing calculators never.
    calculator:
      isMath && grade === 6 && session === 2 ? { type: 'four-function-sqrt' } : null,
  };
}
