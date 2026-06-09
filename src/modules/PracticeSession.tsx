import { useState } from 'react';
import type { LearningModule, ResponsePayload } from './types';
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

interface Result {
  id: string;
  title: string;
  correct: boolean;
}

const isFullCredit = (s: Score) => s.maxScore > 0 && s.score >= s.maxScore;

/** Plays a sequence of single-item practice modules: answer → submit (scored) →
 * next, then an end-of-session summary. Each module's first item is scored. */
export function PracticeSession({ modules, onRecord, onExit }: PracticeSessionProps) {
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<ResponsePayload | null>(null);
  const [submitted, setSubmitted] = useState<Score | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  if (modules.length === 0) {
    return (
      <div>
        <p>No practice questions available yet.</p>
        <button type="button" onClick={onExit}>
          Back
        </button>
      </div>
    );
  }

  if (index >= modules.length) {
    const correct = results.filter((r) => r.correct).length;
    return (
      <section aria-label="Practice results">
        <h2>Practice complete</h2>
        <p role="status">{`You scored ${correct} of ${modules.length}.`}</p>
        <ul>
          {results.map((r) => (
            <li key={r.id}>
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

  const current = modules[index];
  const item = current.items[0];
  const last = index + 1 >= modules.length;

  const submit = () => {
    if (!response) return;
    const score = scoreResponse(item, response) ?? { score: 0, maxScore: 1 };
    setSubmitted(score);
    setResults((r) => [...r, { id: current.meta.id, title: current.meta.title, correct: isFullCredit(score) }]);
    onRecord?.(current.meta.id, current.meta.standards[0] ?? current.meta.cluster, score);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setResponse(null);
    setSubmitted(null);
  };

  return (
    <section aria-label="Practice session">
      <p>
        <small>{`Question ${index + 1} of ${modules.length}`}</small>
      </p>
      <h2>{current.meta.title}</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{item.stem}</p>
      <ItemRenderer
        item={item}
        value={response}
        onChange={setResponse}
        disabled={submitted !== null}
      />
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
