import { useState } from 'react';
import { defaultAccommodations, toggle, type AccommodationKey } from '../a11y/accommodations';

const LABELS: Record<AccommodationKey, string> = {
  textToSpeech: 'Text-to-Speech',
  answerMasking: 'Answer Masking',
  reverseContrast: 'Reverse Contrast',
};

export function AccommodationsBar() {
  const [state, setState] = useState(defaultAccommodations);
  return (
    <div
      style={state.reverseContrast ? { background: '#000', color: '#fff' } : undefined}
      aria-label="Accommodations"
    >
      {(Object.keys(LABELS) as AccommodationKey[]).map((k) => (
        <label key={k} style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={state[k]}
            onChange={() => setState((s) => toggle(s, k))}
          />{' '}
          {LABELS[k]}
        </label>
      ))}
    </div>
  );
}
