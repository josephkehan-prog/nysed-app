import { describe, it, expect } from 'vitest';
import {
  defaultAccommodations,
  toggle,
  set,
  anyEnabled,
} from './accommodations';

describe('accommodations', () => {
  it('defaults to everything off', () => {
    expect(defaultAccommodations).toEqual({
      textToSpeech: false,
      answerMasking: false,
      reverseContrast: false,
    });
    expect(anyEnabled(defaultAccommodations)).toBe(false);
  });

  it('toggles a single accommodation without mutating the input', () => {
    const next = toggle(defaultAccommodations, 'textToSpeech');
    expect(next.textToSpeech).toBe(true);
    expect(defaultAccommodations.textToSpeech).toBe(false); // immutable
    expect(next.answerMasking).toBe(false);
  });

  it('toggles back off', () => {
    const on = toggle(defaultAccommodations, 'reverseContrast');
    expect(toggle(on, 'reverseContrast').reverseContrast).toBe(false);
  });

  it('sets an explicit value', () => {
    expect(set(defaultAccommodations, 'answerMasking', true).answerMasking).toBe(true);
  });

  it('anyEnabled is true when any accommodation is on', () => {
    expect(anyEnabled(set(defaultAccommodations, 'answerMasking', true))).toBe(true);
  });
});
