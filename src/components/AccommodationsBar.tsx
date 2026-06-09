import { useAccommodations } from '../a11y/AccommodationsContext';
import type { AccommodationKey } from '../a11y/accommodations';

const LABELS: Record<AccommodationKey, string> = {
  textToSpeech: 'Text-to-Speech',
  answerMasking: 'Answer Masking',
  reverseContrast: 'Reverse Contrast',
};

/** Accommodations toggles, backed by the shared AccommodationsProvider so the rest
 * of the session (ItemRenderer, ModulePlayer) honors the same state. */
export function AccommodationsBar() {
  const { state, toggle } = useAccommodations();
  return (
    <div
      role="group"
      aria-label="Accommodations"
      style={state.reverseContrast ? { background: '#000', color: '#fff' } : undefined}
    >
      {(Object.keys(LABELS) as AccommodationKey[]).map((k) => (
        <label key={k} style={{ marginRight: 12 }}>
          <input type="checkbox" checked={state[k]} onChange={() => toggle(k)} /> {LABELS[k]}
        </label>
      ))}
    </div>
  );
}
