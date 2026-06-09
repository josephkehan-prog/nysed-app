// Contract for the interactive learning-module platform. A LearningModule is
// content (data, not code) produced by the ingestion pipeline; interactionType
// is the single discriminant that drives both the rendered widget and the scorer.
import type { Subject } from '../nextera/tools';

export type Domain = Subject; // 'math' | 'ela' — math first

export type InteractionType = 'numeric' | 'math' | 'choice' | 'text' | 'order';

export interface ChoiceOption {
  id: string;
  /** Display label; may contain TeX. Never a correctness signal. */
  label: string;
}

export interface ItemConfig {
  /** choice: the options to render. */
  choices?: ChoiceOption[];
  /** order: the tokens to arrange (initial display order). */
  tokens?: ChoiceOption[];
  /** choice: allow more than one selection. */
  multiple?: boolean;
  /** numeric: absolute tolerance for a correct value (default 0). */
  tolerance?: number;
  /** numeric: unit shown beside the field (cosmetic). */
  unit?: string;
}

/** How an item is graded. Mirrors InteractionType. */
export type AnswerSpec =
  | { type: 'numeric'; value: number; tolerance?: number }
  | { type: 'math'; expected: string } // LaTeX, compared via Compute Engine
  | { type: 'choice'; correct: string[] } // option ids
  | { type: 'text'; accept: string[] } // accepted answers (compared normalized)
  | { type: 'order'; correctOrder: string[] }; // token ids in the correct sequence

/** What a controlled widget emits / what the player scores. Carries no keys. */
export type ResponsePayload =
  | { type: 'numeric'; value: number | null }
  | { type: 'math'; latex: string }
  | { type: 'choice'; selected: string[] }
  | { type: 'text'; text: string }
  | { type: 'order'; ordered: string[] };

export type ModuleKind = 'practice' | 'explore'; // practice = auto-scored; explore = worked-solution reveal

export interface ContentSource {
  name: string; // e.g. 'Illustrative Mathematics'
  license: string; // e.g. 'CC BY 4.0'
  attribution: string;
  url?: string;
}

export interface ModuleMeta {
  id: string;
  domain: Domain;
  /** Domain cluster, e.g. '6.G'. */
  cluster: string;
  /** CCSS standards this module aligns to, e.g. ['6.G.A', '6.RP.A.3']. */
  standards: string[];
  title: string;
  kind: ModuleKind;
  source: ContentSource;
}

export interface PracticeItem {
  /** Question text; may contain TeX/markdown. */
  stem: string;
  interactionType: InteractionType;
  config?: ItemConfig;
  /** Present for auto-scored ('practice') items. */
  answer?: AnswerSpec;
  /** Worked solution shown for 'explore' items (or after a practice attempt). */
  workedSolution?: string;
}

export interface LearningModule {
  meta: ModuleMeta;
  items: PracticeItem[];
}
