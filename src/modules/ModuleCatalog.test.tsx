// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import { ModuleCatalog } from './ModuleCatalog';

afterEach(cleanup);

describe('ModuleCatalog', () => {
  it('loads math modules and groups them by cluster', async () => {
    render(<ModuleCatalog domain="math" onOpen={() => {}} />);
    // The sample 'Unit Rate' module lives under cluster 6.RP.
    expect(await screen.findByRole('button', { name: /unit rate/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '6.RP' })).toBeInTheDocument();
  });

  it('renders ELA reading modules grouped by cluster', async () => {
    render(<ModuleCatalog domain="ela" onOpen={() => {}} />);
    expect(await screen.findByRole('button', { name: /lighthouse keeper/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '6.RL' })).toBeInTheDocument();
  });

  it('marks modules the student has already worked on', async () => {
    render(
      <ModuleCatalog domain="math" onOpen={() => {}} engagedIds={new Set(['sample-unit-rate'])} />,
    );
    const btn = await screen.findByRole('button', { name: /unit rate/i });
    const li = btn.closest('li') as HTMLElement;
    expect(within(li).getByLabelText(/worked on/i)).toBeInTheDocument();
  });
});
