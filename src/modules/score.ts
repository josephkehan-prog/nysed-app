// Browser-side scoring for module practice items. Synchronous: math-equivalence
// uses the already-installed Compute Engine (via mathlive); choice reuses the QTI
// scorer. 'explore' items (no answer) are not auto-scored.
import { ComputeEngine } from '@cortex-js/compute-engine';
import { scoreItem } from '../scoring/score';
import { numberLineMatch } from '../interactions/checkers';
import type { ResponseDeclaration, Score } from '../scoring/types';
import type { PracticeItem, ResponsePayload } from './types';

// Constructed lazily so importing this module doesn't build the engine until a
// math item is actually scored.
let _ce: ComputeEngine | null = null;
function engine(): ComputeEngine {
  return (_ce ??= new ComputeEngine());
}

/**
 * True iff two LaTeX expressions are mathematically equivalent. `isEqual` handles
 * both numeric (½ vs 0.5) and symbolic (2x+3 vs 3+2x) equality; when it can't
 * decide (`undefined`), fall back to comparing numeric evaluations. Never throws.
 */
export function mathEquivalent(candidateLatex: string, expectedLatex: string): boolean {
  const ce = engine();
  let a, b;
  try {
    a = ce.parse(candidateLatex);
    b = ce.parse(expectedLatex);
  } catch {
    return false;
  }
  const eq = a.isEqual(b);
  if (eq === true) return true;
  if (eq === false) return false;
  // Undecidable → numeric fallback.
  try {
    const va = a.N().valueOf();
    const vb = b.N().valueOf();
    if (typeof va === 'number' && typeof vb === 'number') return Math.abs(va - vb) <= 1e-9;
  } catch {
    /* fall through */
  }
  return false;
}

/** Score a response against the item's answer. Returns null for un-scored items. */
export function scoreResponse(item: PracticeItem, response: ResponsePayload): Score | null {
  const answer = item.answer;
  if (!answer) return null; // 'explore' item — reveal worked solution instead
  const maxScore = 1;
  const wrong: Score = { score: 0, maxScore };

  switch (response.type) {
    case 'numeric': {
      if (answer.type !== 'numeric' || response.value === null) return wrong;
      const tol = answer.tolerance ?? item.config?.tolerance ?? 0;
      return { score: Math.abs(response.value - answer.value) <= tol ? maxScore : 0, maxScore };
    }
    case 'math': {
      if (answer.type !== 'math') return wrong;
      return { score: mathEquivalent(response.latex, answer.expected) ? maxScore : 0, maxScore };
    }
    case 'choice': {
      if (answer.type !== 'choice') return wrong;
      const decl: ResponseDeclaration = {
        cardinality: answer.correct.length > 1 ? 'multiple' : 'single',
        correctResponse: answer.correct,
      };
      return scoreItem(decl, response.selected);
    }
    case 'text': {
      if (answer.type !== 'text') return wrong;
      const norm = (s: string) => s.trim().toLowerCase();
      const ok = answer.accept.some((a) => norm(a) === norm(response.text));
      return { score: ok ? maxScore : 0, maxScore };
    }
    case 'order': {
      if (answer.type !== 'order') return wrong;
      const decl: ResponseDeclaration = { cardinality: 'ordered', correctResponse: answer.correctOrder };
      return scoreItem(decl, response.ordered);
    }
    case 'numberline': {
      if (answer.type !== 'numberline' || response.value === null) return wrong;
      const tol = answer.tolerance ?? item.config?.tolerance ?? 0;
      return { score: numberLineMatch(response.value, answer.value, tol) ? maxScore : 0, maxScore };
    }
  }
}
