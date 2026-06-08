// QTI-style response/scoring contracts for the deterministic scorer.
// Mirrors the structure of QTI 3.0 qti-response-declaration so items can be
// scored server-side without human review.

export type Cardinality = 'single' | 'multiple' | 'ordered';

export interface MapEntry {
  /** The response value this entry matches. */
  key: string;
  /** Points awarded when a candidate value equals `key`. */
  value: number;
}

/** QTI `mapping` — drives partial-credit scoring (map_response). */
export interface Mapping {
  entries: MapEntry[];
  /** Points for any candidate value not present in `entries`. Defaults to 0. */
  defaultValue?: number;
  /** Clamp the mapped total to be >= lowerBound. */
  lowerBound?: number;
  /** Clamp the mapped total to be <= upperBound. */
  upperBound?: number;
}

export interface ResponseDeclaration {
  cardinality: Cardinality;
  /** Correct value(s). Always an array; `single` cardinality uses index 0. */
  correctResponse: string[];
  /** When present, score with QTI `map_response` (partial credit) instead of `match_correct`. */
  mapping?: Mapping;
  /** Full marks for an exact `match_correct`. Defaults to 1. Ignored when `mapping` is set. */
  maxScore?: number;
}

export type CandidateResponse = string | string[] | null | undefined;

export interface Score {
  score: number;
  maxScore: number;
}
