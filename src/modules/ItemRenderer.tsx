import type { PracticeItem, ResponsePayload } from './types';

export interface ItemRendererProps {
  item: PracticeItem;
  value: ResponsePayload | null;
  onChange: (response: ResponsePayload) => void;
  disabled?: boolean;
}

/** Renders the input for one item, dispatching on interactionType. Controlled:
 * emits a ResponsePayload on every edit; never sees the answer key. */
export function ItemRenderer({ item, value, onChange, disabled }: ItemRendererProps) {
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
      return (
        <fieldset style={{ border: 0, padding: 0 }}>
          {(item.config?.choices ?? []).map((c) => (
            <label key={c.id} style={{ display: 'block' }}>
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={`choice-${item.stem.slice(0, 8)}`}
                disabled={disabled}
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
              {c.label}
            </label>
          ))}
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
