// Practice-session builder: selects the auto-scorable modules for a domain and
// orders them into a short session. Pure (deterministic) so it's unit-testable.
import type { LearningModule } from './types';

/** Auto-scorable practice modules, ordered by cluster then id, capped at `size`. */
export function buildPracticeSession(modules: LearningModule[], size = 10): LearningModule[] {
  return modules
    .filter((m) => m.items.some((i) => i.answer))
    .sort((a, b) => {
      const byCluster = a.meta.cluster.localeCompare(b.meta.cluster);
      return byCluster !== 0 ? byCluster : a.meta.id.localeCompare(b.meta.id);
    })
    .slice(0, size);
}
