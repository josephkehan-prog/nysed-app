// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ModulePlayer } from './ModulePlayer';
import { AccommodationsProvider } from '../a11y/AccommodationsContext';
import type { LearningModule } from './types';

afterEach(cleanup);

const exploreMod: LearningModule = {
  meta: {
    id: 'e',
    domain: 'math',
    cluster: '6.G',
    standards: ['6.G.A'],
    title: 'Painting a Barn',
    kind: 'explore',
    source: { name: 'IM', license: 'CC BY-NC-SA 4.0', attribution: 'Illustrative Mathematics' },
  },
  items: [{ stem: 'How much paint?', interactionType: 'text', workedSolution: 'It costs $532.' }],
};

const practiceMod: LearningModule = {
  meta: {
    id: 'p',
    domain: 'math',
    cluster: '6.RP',
    standards: ['6.RP.A.3'],
    title: 'Unit Rate',
    kind: 'practice',
    source: { name: 'S', license: 'CC BY 4.0', attribution: 'S' },
  },
  items: [{ stem: '120 miles in 3 hours?', interactionType: 'numeric', answer: { type: 'numeric', value: 40 } }],
};

const multiMod: LearningModule = {
  meta: {
    id: 'multi',
    domain: 'math',
    cluster: '6.RP',
    standards: ['6.RP.A.1'],
    title: 'Two-parter',
    kind: 'practice',
    source: { name: 'S', license: 'CC BY 4.0', attribution: 'S' },
  },
  items: [
    { stem: '2 + 2?', interactionType: 'numeric', answer: { type: 'numeric', value: 4 } },
    { stem: '3 + 3?', interactionType: 'numeric', answer: { type: 'numeric', value: 6 } },
  ],
};

describe('ModulePlayer', () => {
  it('explore: reveals the worked solution on demand', () => {
    render(<ModulePlayer module={exploreMod} onExit={() => {}} />);
    expect(screen.getByText('How much paint?')).toBeInTheDocument();
    expect(screen.queryByText(/costs \$532/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show worked solution/i }));
    expect(screen.getByText(/costs \$532/)).toBeInTheDocument();
  });

  it('practice: marks a correct numeric answer', () => {
    render(<ModulePlayer module={practiceMod} onExit={() => {}} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '40' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status')).toHaveTextContent(/correct/i);
  });

  it('practice: marks a wrong numeric answer', () => {
    render(<ModulePlayer module={practiceMod} onExit={() => {}} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '41' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status')).toHaveTextContent(/not quite/i);
  });

  it('renders a module-level passage above the items', () => {
    const reading: LearningModule = {
      meta: {
        id: 'r',
        domain: 'ela',
        cluster: '6.RL',
        standards: ['6.RL.1'],
        title: 'A Reading',
        kind: 'practice',
        source: { name: 'S', license: 'CC BY 4.0', attribution: 'S' },
      },
      passage: 'The fox crossed the frozen river at dawn.',
      items: [
        {
          stem: 'When did the fox cross?',
          interactionType: 'choice',
          config: { choices: [{ id: 'a', label: 'dawn' }, { id: 'b', label: 'noon' }] },
          answer: { type: 'choice', correct: ['a'] },
        },
      ],
    };
    render(<ModulePlayer module={reading} onExit={() => {}} />);
    expect(screen.getByText(/frozen river at dawn/i)).toBeInTheDocument();
  });

  it('multi-item: renders every item and aggregates the score', () => {
    render(<ModulePlayer module={multiMod} onExit={() => {}} />);
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);
    const checks = screen.getAllByRole('button', { name: 'Check' });
    fireEvent.change(inputs[0], { target: { value: '4' } }); // correct
    fireEvent.click(checks[0]);
    fireEvent.change(inputs[1], { target: { value: '0' } }); // wrong
    fireEvent.click(checks[1]);
    expect(screen.getByText(/1 of 2 correct/i)).toBeInTheDocument();
  });

  it('calls onExit from the Back button', () => {
    const onExit = vi.fn();
    render(<ModulePlayer module={exploreMod} onExit={onExit} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(onExit).toHaveBeenCalled();
  });

  it('practice: reports the score via onScored when checked', () => {
    const onScored = vi.fn();
    render(<ModulePlayer module={practiceMod} onExit={() => {}} onScored={onScored} />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '40' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(onScored).toHaveBeenCalledWith({ score: 1, maxScore: 1 });
  });

  it('explore: reports a visit via onVisited when the worked solution is revealed', () => {
    const onVisited = vi.fn();
    render(<ModulePlayer module={exploreMod} onExit={() => {}} onVisited={onVisited} />);
    fireEvent.click(screen.getByRole('button', { name: /show worked solution/i }));
    expect(onVisited).toHaveBeenCalled();
  });

  it('reads the stem aloud when text-to-speech is enabled', () => {
    const speak = vi.fn();
    const w = window as unknown as {
      speechSynthesis: { speak: typeof speak; cancel: () => void };
      SpeechSynthesisUtterance: unknown;
    };
    w.speechSynthesis = { speak, cancel: vi.fn() };
    w.SpeechSynthesisUtterance = class {
      text: string;
      constructor(t: string) {
        this.text = t;
      }
    };
    render(
      <AccommodationsProvider initial={{ textToSpeech: true }}>
        <ModulePlayer module={exploreMod} onExit={() => {}} />
      </AccommodationsProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /read aloud/i }));
    expect(speak).toHaveBeenCalledTimes(1);
    expect((speak.mock.calls[0][0] as { text: string }).text).toBe('How much paint?');
  });
});
