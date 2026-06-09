import { useState } from 'react';
import type { LearningModule, PracticeItem, ResponsePayload } from './types';
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

interface ItemPanelProps {
  item: PracticeItem;
  index: number;
  showNumber: boolean;
  onScored?: (score: Score) => void;
  onVisited?: () => void;
}

/** One item's interactive panel: stem (+ read-aloud), input, check/feedback, and the
 * worked-solution reveal. Holds its own response/checked state. */
function ItemPanel({ item, index, showNumber, onScored, onVisited }: ItemPanelProps) {
  const { textToSpeech } = useAccommodationsState();
  const [response, setResponse] = useState<ResponsePayload | null>(null);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const result = checked && response ? scoreResponse(item, response) : null;

  return (
    <section>
      {showNumber ? (
        <p>
          <small>Question {index + 1}</small>
        </p>
      ) : null}
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
  );
}

/** Plays a module's items as a worksheet, auto-scoring 'practice' items and revealing
 * 'explore' worked solutions. For multi-item modules it shows an aggregate score. */
export function ModulePlayer({ module, onExit, onScored, onVisited }: ModulePlayerProps) {
  const multi = module.items.length > 1;
  const scorable = module.items.filter((i) => i.answer).length;
  const [scores, setScores] = useState<Record<number, Score>>({});
  const correct = Object.values(scores).filter((s) => s.score > 0).length;

  return (
    <div>
      <button type="button" onClick={onExit}>
        ← Back
      </button>
      <h2>{module.meta.title}</h2>
      <p>
        <small>{module.meta.standards.join(' · ') || module.meta.cluster}</small>
      </p>

      {module.items.map((item, i) => (
        <ItemPanel
          key={i}
          item={item}
          index={i}
          showNumber={multi}
          onScored={(s) => {
            setScores((prev) => ({ ...prev, [i]: s }));
            onScored?.(s);
          }}
          onVisited={onVisited}
        />
      ))}

      {multi && scorable > 0 ? <p role="status">{`${correct} of ${scorable} correct`}</p> : null}

      <footer>
        <small>
          Source: {module.meta.source.attribution} ({module.meta.source.license})
        </small>
      </footer>
    </div>
  );
}
