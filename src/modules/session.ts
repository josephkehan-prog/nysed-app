// Practice-session builder: selects the auto-scorable modules for a domain and
// orders them into a short session. Pure (deterministic) so it's unit-testable.
import type { LearningModule } from './types';
import type { StandardMastery } from '../progress/mastery';

const isScorable = (m: LearningModule) => m.items.some((i) => i.answer);

const tieBreak = (a: LearningModule, b: LearningModule) => {
  const byCluster = a.meta.cluster.localeCompare(b.meta.cluster);
  return byCluster !== 0 ? byCluster : a.meta.id.localeCompare(b.meta.id);
};

/** Auto-scorable practice modules, ordered by cluster then id, capped at `size`. */
export function buildPracticeSession(modules: LearningModule[], size = 10): LearningModule[] {
  return modules.filter(isScorable).sort(tieBreak).slice(0, size);
}

/** Adaptive review: auto-scorable modules ordered by how weak their primary standard
 * is (unattempted standards first, then ascending mastery), capped at `size`. */
export function buildReviewSession(
  modules: LearningModule[],
  mastery: StandardMastery[],
  size = 10,
): LearningModule[] {
  const masteryOf = new Map(mastery.map((m) => [m.standard, m.mastery]));
  const weight = (m: LearningModule) => {
    const primary = m.meta.standards[0];
    const score = primary !== undefined ? masteryOf.get(primary) : undefined;
    return score ?? -1; // unattempted standard → highest priority
  };
  return modules
    .filter(isScorable)
    .sort((a, b) => weight(a) - weight(b) || tieBreak(a, b))
    .slice(0, size);
}
