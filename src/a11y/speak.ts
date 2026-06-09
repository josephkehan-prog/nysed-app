// Minimal text-to-speech via the Web Speech API. No-ops where unavailable
// (SSR, or browsers without speechSynthesis) so callers can fire it unconditionally.
export function speak(text: string): void {
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
  synth.cancel();
  synth.speak(new SpeechSynthesisUtterance(text));
}
