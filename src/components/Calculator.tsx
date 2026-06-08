import { useState } from 'react';
import { initialCalc, pressKey } from '../tools/calculator';

const KEYS = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C', 'sqrt'];

/** Four-function + square-root calculator UI (Grade 6, Session 2). */
export function Calculator() {
  const [state, setState] = useState(initialCalc);
  return (
    <div>
      <output style={{ display: 'block', fontFamily: 'monospace' }}>{state.display}</output>
      <div>
        {KEYS.map((k) => (
          <button key={k} type="button" onClick={() => setState((s) => pressKey(s, k))}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
