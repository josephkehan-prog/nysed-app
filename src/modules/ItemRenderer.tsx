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
    case 'numberline': {
      const v = value?.type === 'numberline' ? value.value : null;
      const min = item.config?.min ?? 0;
      const max = item.config?.max ?? 10;
      const step = item.config?.step ?? 1;
      return (
        <label>
          Place on the number line:{' '}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            value={v ?? min}
            onChange={(e) => onChange({ type: 'numberline', value: Number(e.target.value) })}
          />{' '}
          <output>{v ?? '—'}</output>
        </label>
      );
    }
    case 'order': {
      const tokens = item.config?.tokens ?? [];
      const order =
        value?.type === 'order' && value.ordered.length ? value.ordered : tokens.map((t) => t.id);
      const labelOf = (id: string) => tokens.find((t) => t.id === id)?.label ?? id;
      const move = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= order.length) return;
        const next = [...order];
        [next[i], next[j]] = [next[j], next[i]];
        onChange({ type: 'order', ordered: next });
      };
      return (
        <ol>
          {order.map((id, i) => (
            <li key={id}>
              {labelOf(id)}{' '}
              <button
                type="button"
                aria-label={`Move ${labelOf(id)} up`}
                disabled={disabled || i === 0}
                onClick={() => move(i, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Move ${labelOf(id)} down`}
                disabled={disabled || i === order.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
            </li>
          ))}
        </ol>
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
