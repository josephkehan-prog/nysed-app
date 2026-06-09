// Pure mastery aggregation, mirroring src/server/store.ts's masteryByStandard but
// in-memory and browser-safe (no node:sqlite) so the client ProgressStore can reuse
// it. Callers pass attempts already scoped to one student.

export interface Attempt {
  studentId: string;
  moduleId: string;
  /** CCSS standard this attempt counts toward, e.g. '6.RP.A.3'. */
  standard: string;
  score: number;
  maxScore: number;
}

export interface StandardMastery {
  standard: string;
  attempts: number;
  earned: number;
  possible: number;
  /** earned / possible in [0, 1]; 0 when nothing is possible. */
  mastery: number;
}

/** Group attempts by standard, summing score/maxScore, sorted by standard. */
export function aggregateMastery(attempts: Attempt[]): StandardMastery[] {
  const byStandard = new Map<string, { attempts: number; earned: number; possible: number }>();
  for (const a of attempts) {
    const agg = byStandard.get(a.standard) ?? { attempts: 0, earned: 0, possible: 0 };
    agg.attempts += 1;
    agg.earned += a.score;
    agg.possible += a.maxScore;
    byStandard.set(a.standard, agg);
  }
  return [...byStandard.entries()]
    .sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0))
    .map(([standard, agg]) => ({
      standard,
      attempts: agg.attempts,
      earned: agg.earned,
      possible: agg.possible,
      mastery: agg.possible > 0 ? agg.earned / agg.possible : 0,
    }));
}
