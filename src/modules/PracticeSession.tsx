import { useState } from 'react';
import type { LearningModule, PracticeItem, ResponsePayload } from './types';
import type { Score } from '../scoring/types';
import { scoreResponse } from './score';
import { ItemRenderer } from './ItemRenderer';

export interface PracticeSessionProps {
  /** The ordered session, e.g. from buildPracticeSession(). */
  modules: LearningModule[];
  /** Called once per submitted item, for progress persistence. */
  onRecord?: (moduleId: string, standard: string, score: Score) => void;
  onExit: () => void;
}

interface Step {
  module: LearningModule;
  item: PracticeItem;
}

interface Result {
  title: string;
  correct: boolean;
}

const isFullCredit = (s: Score) => s.maxScore > 0 && s.score >= s.maxScore;

/** Plays a flat sequence of auto-scorable items (multi-item modules expand into their
 * individual questions): answer → submit (scored) → next, then a scored summary. */
export function PracticeSession({ modules, onRecord, onExit }: PracticeSessionProps) {
  const steps: Step[] = modules.flatMap((m) =>
    m.items.filter((i) => i.answer).map((item) => ({ module: m, item })),
  );

  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<ResponsePayload | null>(null);
  const [submitted, setSubmitted] = useState<Score | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  if (steps.length === 0) {
    return (
      <div>
        <p>No practice questions available yet.</p>
        <button type="button" onClick={onExit}>
          Back
        </button>
      </div>
    );
  }

  if (index >= steps.length) {
    const correct = results.filter((r) => r.correct).length;
    return (
      <section aria-label="Practice results">
        <h2>Practice complete</h2>
        <p role="status">{`You scored ${correct} of ${steps.length}.`}</p>
        <ul>
          {results.map((r, i) => (
            <li key={i}>
              {r.correct ? '✓' : '✗'} {r.title}
            </li>
          ))}
        </ul>
        <button type="button" onClick={onExit}>
          Back to catalog
        </button>
      </section>
    );
  }

  const { module: mod, item } = steps[index];
  const last = index + 1 >= steps.length;

  const submit = () => {
    if (!response) return;
    const score = scoreResponse(item, response) ?? { score: 0, maxScore: 1 };
    setSubmitted(score);
    setResults((r) => [...r, { title: mod.meta.title, correct: isFullCredit(score) }]);
    onRecord?.(mod.meta.id, mod.meta.standards[0] ?? mod.meta.cluster, score);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setResponse(null);
    setSubmitted(null);
  };

  return (
    <section aria-label="Practice session">
      <p>
        <small>{`Question ${index + 1} of ${steps.length}`}</small>
      </p>
      <h2>{mod.meta.title}</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{item.stem}</p>
      <ItemRenderer item={item} value={response} onChange={setResponse} disabled={submitted !== null} />
      {submitted ? (
        <p>
          <span role="status">{isFullCredit(submitted) ? '✓ Correct' : '✗ Not quite'}</span>{' '}
          <button type="button" onClick={next}>
            {last ? 'See results' : 'Next'}
          </button>
        </p>
      ) : (
        <p>
          <button type="button" disabled={!response} onClick={submit}>
            Submit
          </button>
        </p>
      )}
      <p>
        <button type="button" onClick={onExit}>
          Exit practice
        </button>
      </p>
    </section>
  );
}
