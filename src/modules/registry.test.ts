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

  it('loads ELA reading modules with passages', async () => {
    const mods = await loadModules('ela');
    expect(mods.length).toBeGreaterThan(0);
    expect(mods.every((m) => m.meta.domain === 'ela')).toBe(true);
    expect(mods.some((m) => typeof m.passage === 'string')).toBe(true);
  });

  it('groups modules by cluster', async () => {
    const grouped = byCluster(await loadModules('math'));
    expect(Object.keys(grouped)).toContain('6.RP');
  });
});
