// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {
  AccommodationsProvider,
  useAccommodations,
  useAccommodationsState,
} from './AccommodationsContext';

afterEach(cleanup);

function ToggleProbe() {
  const { state, toggle } = useAccommodations();
  return (
    <button type="button" onClick={() => toggle('textToSpeech')}>
      tts:{state.textToSpeech ? 'on' : 'off'}
    </button>
  );
}

function StateProbe() {
  const state = useAccommodationsState();
  return <span>masking:{state.answerMasking ? 'on' : 'off'}</span>;
}

describe('AccommodationsContext', () => {
  it('toggles state through the provider', () => {
    render(
      <AccommodationsProvider>
        <ToggleProbe />
      </AccommodationsProvider>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('tts:off');
    fireEvent.click(btn);
    expect(btn).toHaveTextContent('tts:on');
  });

  it('can seed initial accommodations (for tests / deep links)', () => {
    render(
      <AccommodationsProvider initial={{ answerMasking: true }}>
        <StateProbe />
      </AccommodationsProvider>,
    );
    expect(screen.getByText('masking:on')).toBeInTheDocument();
  });

  it('useAccommodations throws outside a provider', () => {
    const spy = () => render(<ToggleProbe />);
    expect(spy).toThrow(/AccommodationsProvider/);
  });

  it('useAccommodationsState falls back to defaults outside a provider', () => {
    render(<StateProbe />);
    expect(screen.getByText('masking:off')).toBeInTheDocument();
  });
});
