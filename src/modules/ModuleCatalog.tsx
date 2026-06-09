import { useEffect, useState } from 'react';
import type { Domain, LearningModule } from './types';
import { loadModules, byCluster } from './registry';

export interface ModuleCatalogProps {
  domain: Domain;
  onOpen: (module: LearningModule) => void;
}

/** Lists a domain's modules grouped by cluster (the Coherence-Map layout). */
export function ModuleCatalog({ domain, onOpen }: ModuleCatalogProps) {
  const [modules, setModules] = useState<LearningModule[] | null>(null);

  useEffect(() => {
    let live = true;
    loadModules(domain).then((m) => {
      if (live) setModules(m);
    });
    return () => {
      live = false;
    };
  }, [domain]);

  if (!modules) return <p>Loading…</p>;
  if (modules.length === 0) return <p>No modules yet for this subject.</p>;

  const grouped = byCluster(modules);
  return (
    <div>
      {Object.keys(grouped)
        .sort()
        .map((cluster) => (
          <section key={cluster}>
            <h2>{cluster}</h2>
            <ul>
              {grouped[cluster].map((m) => (
                <li key={m.meta.id}>
                  <button type="button" onClick={() => onOpen(m)}>
                    {m.meta.title}
                  </button>{' '}
                  <small>{m.meta.standards.join(', ')}</small>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
