// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ItemRenderer } from './ItemRenderer';
import type { PracticeItem } from './types';

afterEach(cleanup);

const base = (p: Partial<PracticeItem>): PracticeItem =>
  ({ stem: 's', interactionType: 'text', ...p }) as PracticeItem;

describe('ItemRenderer', () => {
  it('text: emits a text payload on input', () => {
    const onChange = vi.fn();
    render(<ItemRenderer item={base({ interactionType: 'text' })} value={null} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledWith({ type: 'text', text: 'hello' });
  });

  it('numeric: emits a numeric payload and shows the unit', () => {
    const onChange = vi.fn();
    render(
      <ItemRenderer
        item={base({ interactionType: 'numeric', config: { unit: 'mph' } })}
        value={null}
        onChange={onChange}
      />,
    );
    expect(screen.getByText(/mph/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '40' } });
    expect(onChange).toHaveBeenCalledWith({ type: 'numeric', value: 40 });
  });

  it('choice: single-select emits the chosen id', () => {
    const onChange = vi.fn();
    const item = base({
      interactionType: 'choice',
      config: { choices: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] },
    });
    render(<ItemRenderer item={item} value={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith({ type: 'choice', selected: ['b'] });
  });
});
