import { describe, it, expect } from 'vitest';
import { loadModules, byCluster } from './registry';

describe('module registry', () => {
  it('loads math modules with a valid shape', async () => {
    const mods = await loadModules('math');
    expect(mods.length).toBeGreaterThan(0);
    const m = mods[0];
    expect(m.meta.domain).toBe('math');
    expect(m.meta.standards.length).toBeGreaterThan(0);
    expect(m.items.length).toBeGreaterThan(0);
  });

  it('has no ELA modules yet', async () => {
    expect(await loadModules('ela')).toEqual([]);
  });

  it('groups modules by cluster', async () => {
    const grouped = byCluster(await loadModules('math'));
    expect(Object.keys(grouped)).toContain('6.RP');
  });
});
