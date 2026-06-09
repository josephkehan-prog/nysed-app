// Which content panels the practice shell renders for a given subject. Math-only
// panels (graphing, equation entry, calculator) are hidden for ELA; the writing
// and scratch panels are useful in both. Mirrors the availableTools() gating.
import type { Subject } from './tools';

export interface SectionVisibility {
  graphing: boolean;
  equationEntry: boolean;
  calculator: boolean;
  writingSpace: boolean;
  scratchPaper: boolean;
}

export function visibleSections(subject: Subject): SectionVisibility {
  const isMath = subject === 'math';
  return {
    graphing: isMath,
    equationEntry: isMath,
    calculator: isMath,
    // Writing and scratch paper apply to both math and ELA.
    writingSpace: true,
    scratchPaper: true,
  };
}
