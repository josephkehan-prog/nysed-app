// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Toolbar } from './Toolbar';

afterEach(cleanup);

describe('Toolbar', () => {
  it('Grade 4 Session 1 renders no calculator button', () => {
    render(<Toolbar grade={4} session={1} />);
    expect(screen.queryByRole('button', { name: 'Calculator' })).not.toBeInTheDocument();
  });

  it('Grade 6 Session 2 renders a calculator button', () => {
    render(<Toolbar grade={6} session={2} />);
    expect(screen.getByRole('button', { name: 'Calculator' })).toBeInTheDocument();
  });

  it('Grade 4 has no Reference Sheet button', () => {
    render(<Toolbar grade={4} session={2} />);
    expect(screen.queryByRole('button', { name: 'Reference Sheet' })).not.toBeInTheDocument();
  });

  it('Grade 6 has a Reference Sheet button', () => {
    render(<Toolbar grade={6} session={2} />);
    expect(screen.getByRole('button', { name: 'Reference Sheet' })).toBeInTheDocument();
  });

  it('always-on tools (highlighter) render for any grade/session', () => {
    render(<Toolbar grade={4} session={1} />);
    expect(screen.getByRole('button', { name: 'Highlighter' })).toBeInTheDocument();
  });

  it('drawing tool appears only in Session 2', () => {
    const { unmount } = render(<Toolbar grade={6} session={1} />);
    expect(screen.queryByRole('button', { name: 'Drawing Tool' })).not.toBeInTheDocument();
    unmount();
    render(<Toolbar grade={6} session={2} />);
    expect(screen.getByRole('button', { name: 'Drawing Tool' })).toBeInTheDocument();
  });
});
