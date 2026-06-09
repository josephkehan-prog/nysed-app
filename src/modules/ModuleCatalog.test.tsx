// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ModuleCatalog } from './ModuleCatalog';

afterEach(cleanup);

describe('ModuleCatalog', () => {
  it('loads math modules and groups them by cluster', async () => {
    render(<ModuleCatalog domain="math" onOpen={() => {}} />);
    // The sample 'Unit Rate' module lives under cluster 6.RP.
    expect(await screen.findByRole('button', { name: /unit rate/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '6.RP' })).toBeInTheDocument();
  });

  it('shows an empty state for a domain with no modules', async () => {
    render(<ModuleCatalog domain="ela" onOpen={() => {}} />);
    expect(await screen.findByText(/no modules yet/i)).toBeInTheDocument();
  });
});
