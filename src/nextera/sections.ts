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

// RED stub — replaced once the reproducer tests are confirmed failing.
export function visibleSections(_subject: Subject): SectionVisibility {
  return {
    graphing: false,
    equationEntry: false,
    calculator: false,
    writingSpace: false,
    scratchPaper: false,
  };
}
