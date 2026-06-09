// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PracticeSession } from './PracticeSession';
import type { LearningModule } from './types';

afterEach(cleanup);

const numMod = (id: string, value: number): LearningModule => ({
  meta: {
    id,
    domain: 'math',
    cluster: '6.RP',
    standards: ['6.RP.A.1'],
    title: `Q-${id}`,
    kind: 'practice',
    source: { name: 's', license: 'l', attribution: 'a' },
  },
  items: [{ stem: `stem ${id}`, interactionType: 'numeric', answer: { type: 'numeric', value } }],
});

describe('PracticeSession', () => {
  it('plays through items and reports an end-of-session score', () => {
    const onRecord = vi.fn();
    render(
      <PracticeSession modules={[numMod('a', 40), numMod('b', 7)]} onRecord={onRecord} onExit={() => {}} />,
    );
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();

    // Q1 correct
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '40' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByRole('status')).toHaveTextContent(/correct/i);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Q2 wrong
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    fireEvent.click(screen.getByRole('button', { name: 'See results' }));

    expect(screen.getByText(/scored 1 of 2/i)).toBeInTheDocument();
    expect(onRecord).toHaveBeenCalledTimes(2);
  });

  it('flattens a multi-item module into individual questions', () => {
    const twoItem: LearningModule = {
      meta: {
        id: 'two',
        domain: 'math',
        cluster: '6.RP',
        standards: ['6.RP.A.1'],
        title: 'Two-parter',
        kind: 'practice',
        source: { name: 's', license: 'l', attribution: 'a' },
      },
      items: [
        { stem: 'q1', interactionType: 'numeric', answer: { type: 'numeric', value: 4 } },
        { stem: 'q2', interactionType: 'numeric', answer: { type: 'numeric', value: 6 } },
      ],
    };
    render(<PracticeSession modules={[twoItem]} onExit={() => {}} />);
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
  });

  it('exits via the Exit button', () => {
    const onExit = vi.fn();
    render(<PracticeSession modules={[numMod('a', 1)]} onExit={onExit} />);
    fireEvent.click(screen.getByRole('button', { name: /exit practice/i }));
    expect(onExit).toHaveBeenCalled();
  });
});
