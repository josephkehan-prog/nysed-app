import { useState } from 'react';
import type { LearningModule, ResponsePayload } from './types';
import type { Score } from '../scoring/types';
import { scoreResponse } from './score';
import { ItemRenderer } from './ItemRenderer';
import { useAccommodationsState } from '../a11y/AccommodationsContext';
import { speak } from '../a11y/speak';

export interface ModulePlayerProps {
  module: LearningModule;
  onExit: () => void;
  /** Fired when a 'practice' item is checked, with its score (for progress). */
  onScored?: (score: Score) => void;
  /** Fired when an 'explore' worked solution is revealed (counts as engagement). */
  onVisited?: () => void;
}

/** Plays a single-item module: render stem + input, auto-score 'practice' items,
 * reveal the worked solution for 'explore' items (or after a practice attempt). */
export function ModulePlayer({ module, onExit, onScored, onVisited }: ModulePlayerProps) {
  const item = module.items[0];
  const { textToSpeech } = useAccommodationsState();
  const [response, setResponse] = useState<ResponsePayload | null>(null);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const result = checked && response ? scoreResponse(item, response) : null;

  return (
    <div>
      <button type="button" onClick={onExit}>
        ← Back
      </button>
      <h2>{module.meta.title}</h2>
      <p>
        <small>{module.meta.standards.join(' · ') || module.meta.cluster}</small>
      </p>

      <section>
        <p style={{ whiteSpace: 'pre-wrap' }}>{item.stem}</p>
        {textToSpeech ? (
          <button type="button" onClick={() => speak(item.stem)}>
            🔊 Read aloud
          </button>
        ) : null}
        <ItemRenderer
          item={item}
          value={response}
          onChange={(r) => {
            setResponse(r);
            setChecked(false);
          }}
        />

        {item.answer ? (
          <p>
            <button
              type="button"
              disabled={!response}
              onClick={() => {
                setChecked(true);
                if (response) {
                  const s = scoreResponse(item, response);
                  if (s) onScored?.(s);
                }
              }}
            >
              Check
            </button>{' '}
            {result ? (
              <span role="status">{result.score > 0 ? '✓ Correct' : '✗ Not quite'}</span>
            ) : null}
          </p>
        ) : null}

        {item.workedSolution ? (
          <p>
            <button
              type="button"
              onClick={() => {
                setRevealed(true);
                onVisited?.();
              }}
            >
              Show worked solution
            </button>
            {revealed ? (
              <blockquote style={{ whiteSpace: 'pre-wrap', borderLeft: '3px solid #ccc', paddingLeft: 12 }}>
                {item.workedSolution}
              </blockquote>
            ) : null}
          </p>
        ) : null}
      </section>

      <footer>
        <small>
          Source: {module.meta.source.attribution} ({module.meta.source.license})
        </small>
      </footer>
    </div>
  );
}
