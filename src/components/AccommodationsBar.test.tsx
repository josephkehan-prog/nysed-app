// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AccommodationsBar } from './AccommodationsBar';
import { AccommodationsProvider } from '../a11y/AccommodationsContext';

afterEach(cleanup);

describe('AccommodationsBar', () => {
  it('toggles an accommodation through the shared provider', () => {
    render(
      <AccommodationsProvider>
        <AccommodationsBar />
      </AccommodationsProvider>,
    );
    const tts = screen.getByRole('checkbox', { name: /text-to-speech/i });
    expect(tts).not.toBeChecked();
    fireEvent.click(tts);
    expect(tts).toBeChecked();
  });

  it('reflects reverse contrast from the provider', () => {
    render(
      <AccommodationsProvider initial={{ reverseContrast: true }}>
        <AccommodationsBar />
      </AccommodationsProvider>,
    );
    expect(screen.getByRole('group', { name: 'Accommodations' })).toHaveStyle({ color: '#fff' });
  });
});
