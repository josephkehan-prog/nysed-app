// Lazy per-domain module catalog. Each domain's modules are code-split so the app
// shell stays light; the catalog UI mirrors the Coherence Map by grouping on cluster.
import type { Domain, LearningModule } from './types';

const LOADERS: Record<Domain, () => Promise<LearningModule[]>> = {
  math: () => import('./content/math/index').then((m) => m.modules),
  ela: () => import('./content/ela/index').then((m) => m.modules),
};

export function loadModules(domain: Domain): Promise<LearningModule[]> {
  return LOADERS[domain]();
}

/** Group a domain's modules by cluster (e.g. '6.RP', '6.NS') for catalog display. */
export function byCluster(modules: LearningModule[]): Record<string, LearningModule[]> {
  const out: Record<string, LearningModule[]> = {};
  for (const m of modules) (out[m.meta.cluster] ??= []).push(m);
  return out;
}
