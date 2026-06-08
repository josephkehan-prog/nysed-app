// Testing accommodations state (mirrors Nextera): text-to-speech, answer masking,
// reverse contrast. Pure helpers so the UI provider is a thin wrapper.

export interface AccommodationsState {
  textToSpeech: boolean;
  answerMasking: boolean;
  reverseContrast: boolean;
}

export type AccommodationKey = keyof AccommodationsState;

export const defaultAccommodations: AccommodationsState = {
  textToSpeech: false,
  answerMasking: false,
  reverseContrast: false,
};

export function toggle(
  state: AccommodationsState,
  key: AccommodationKey,
): AccommodationsState {
  return { ...state, [key]: !state[key] };
}

export function set(
  state: AccommodationsState,
  key: AccommodationKey,
  value: boolean,
): AccommodationsState {
  return { ...state, [key]: value };
}

export function anyEnabled(state: AccommodationsState): boolean {
  return state.textToSpeech || state.answerMasking || state.reverseContrast;
}
