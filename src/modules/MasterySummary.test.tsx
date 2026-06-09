// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MasterySummary } from './MasterySummary';

afterEach(cleanup);

describe('MasterySummary', () => {
  it('lists each standard with a rounded mastery percentage', () => {
    render(
      <MasterySummary
        mastery={[
          { standard: '6.RP.A.3', attempts: 2, earned: 1, possible: 2, mastery: 0.5 },
          { standard: '6.G.A.1', attempts: 3, earned: 1, possible: 3, mastery: 1 / 3 },
        ]}
      />,
    );
    expect(screen.getByText('6.RP.A.3')).toBeInTheDocument();
    expect(screen.getByText(/50% \(1\/2\)/)).toBeInTheDocument();
    expect(screen.getByText(/33% \(1\/3\)/)).toBeInTheDocument();
  });

  it('shows an empty state when there is no scored progress', () => {
    render(<MasterySummary mastery={[]} />);
    expect(screen.getByText(/mastery by standard will appear here/i)).toBeInTheDocument();
  });
});
