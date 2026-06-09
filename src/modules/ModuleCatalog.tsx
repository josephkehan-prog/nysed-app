import { useEffect, useState } from 'react';
import type { Domain, LearningModule } from './types';
import { loadModules, byCluster } from './registry';

export interface ModuleCatalogProps {
  domain: Domain;
  onOpen: (module: LearningModule) => void;
  /** Ids of modules the student has worked on; drives the progress markers. */
  engagedIds?: Set<string>;
}

/** Lists a domain's modules grouped by cluster (the Coherence-Map layout). */
export function ModuleCatalog({ domain, onOpen, engagedIds }: ModuleCatalogProps) {
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
        .map((cluster) => {
          const inCluster = grouped[cluster];
          const done = engagedIds ? inCluster.filter((m) => engagedIds.has(m.meta.id)).length : 0;
          return (
            <section key={cluster}>
              <h2>{cluster}</h2>
              {engagedIds ? (
                <p style={{ margin: '0 0 6px' }}>
                  <small>
                    {done} of {inCluster.length} worked on
                  </small>
                </p>
              ) : null}
              <ul>
                {inCluster.map((m) => {
                  const engaged = engagedIds?.has(m.meta.id) ?? false;
                  return (
                    <li key={m.meta.id}>
                      <button type="button" onClick={() => onOpen(m)}>
                        {m.meta.title}
                      </button>{' '}
                      <small>{m.meta.standards.join(', ')}</small>
                      {engaged ? (
                        <span aria-label="worked on" title="Worked on" style={{ color: '#2e9e6b' }}>
                          {' '}
                          ✓
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
    </div>
  );
}
