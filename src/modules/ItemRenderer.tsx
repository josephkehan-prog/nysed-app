import { useState } from 'react';
import type { PracticeItem, ResponsePayload } from './types';
import { useAccommodationsState } from '../a11y/AccommodationsContext';

export interface ItemRendererProps {
  item: PracticeItem;
  value: ResponsePayload | null;
  onChange: (response: ResponsePayload) => void;
  disabled?: boolean;
}

/** Renders the input for one item, dispatching on interactionType. Controlled:
 * emits a ResponsePayload on every edit; never sees the answer key. Honors the
 * answer-masking accommodation by covering choice options until revealed. */
export function ItemRenderer({ item, value, onChange, disabled }: ItemRendererProps) {
  const { answerMasking } = useAccommodationsState();
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());

  switch (item.interactionType) {
    case 'numeric': {
      const v = value?.type === 'numeric' ? value.value : null;
      return (
        <label>
          Answer{item.config?.unit ? ` (${item.config.unit})` : ''}:{' '}
          <input
            type="number"
            inputMode="decimal"
            disabled={disabled}
            value={v ?? ''}
            onChange={(e) =>
              onChange({ type: 'numeric', value: e.target.value === '' ? null : Number(e.target.value) })
            }
          />
        </label>
      );
    }
    case 'choice': {
      const selected = value?.type === 'choice' ? value.selected : [];
      const multiple = item.config?.multiple ?? false;
      const toggleRevealed = (id: string) =>
        setRevealed((r) => {
          const next = new Set(r);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      return (
        <fieldset style={{ border: 0, padding: 0 }}>
          {(item.config?.choices ?? []).map((c) => {
            const shown = !answerMasking || revealed.has(c.id);
            return (
              <label key={c.id} style={{ display: 'block' }}>
                <input
                  type={multiple ? 'checkbox' : 'radio'}
                  name={`choice-${item.stem.slice(0, 8)}`}
                  disabled={disabled || !shown}
                  checked={selected.includes(c.id)}
                  onChange={() => {
                    const next = multiple
                      ? selected.includes(c.id)
                        ? selected.filter((x) => x !== c.id)
                        : [...selected, c.id]
                      : [c.id];
                    onChange({ type: 'choice', selected: next });
                  }}
                />{' '}
                {shown ? c.label : <span aria-hidden>▭▭▭▭</span>}
                {answerMasking ? (
                  <button type="button" style={{ marginLeft: 8 }} onClick={() => toggleRevealed(c.id)}>
                    {shown ? 'Mask' : 'Reveal'}
                  </button>
                ) : null}
              </label>
            );
          })}
        </fieldset>
      );
    }
    case 'math': {
      const v = value?.type === 'math' ? value.latex : '';
      return (
        <label>
          Expression:{' '}
          <input
            type="text"
            disabled={disabled}
            value={v}
            onChange={(e) => onChange({ type: 'math', latex: e.target.value })}
          />
        </label>
      );
    }
    case 'text':
    default: {
      const v = value?.type === 'text' ? value.text : '';
      return (
        <label style={{ display: 'block' }}>
          Your response:
          <textarea
            rows={5}
            disabled={disabled}
            value={v}
            style={{ display: 'block', width: '100%' }}
            onChange={(e) => onChange({ type: 'text', text: e.target.value })}
          />
        </label>
      );
    }
  }
}
