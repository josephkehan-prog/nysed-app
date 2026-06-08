// Four-function + square-root calculator engine (NYSED Grade 6, Session 2).
// Pure reducer over button presses so it is fully testable; the UI is a thin shell.

export type Op = '+' | '-' | '*' | '/';

export interface CalcState {
  display: string;
  acc: number | null;
  op: Op | null;
  /** true when the next digit starts a fresh entry. */
  overwrite: boolean;
}

export const initialCalc: CalcState = {
  display: '0',
  acc: null,
  op: null,
  overwrite: true,
};

function fmt(n: number): string {
  if (!Number.isFinite(n)) return 'Error';
  return String(Number(n.toPrecision(12)));
}

function apply(a: number, op: Op, b: number): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? NaN : a / b;
  }
}

export function pressKey(state: CalcState, key: string): CalcState {
  if (key === 'C') return { ...initialCalc };

  if (/^[0-9]$/.test(key)) {
    if (state.display === 'Error') return { ...initialCalc, display: key, overwrite: false };
    if (state.overwrite || state.display === '0') {
      return { ...state, display: key, overwrite: false };
    }
    return { ...state, display: state.display + key };
  }

  if (key === '.') {
    if (state.overwrite || state.display === 'Error') {
      return { ...state, display: '0.', overwrite: false };
    }
    if (!state.display.includes('.')) return { ...state, display: state.display + '.' };
    return state;
  }

  if (key === 'sqrt') {
    const v = Number(state.display);
    const r = v < 0 ? NaN : Math.sqrt(v);
    return { ...state, display: fmt(r), overwrite: true };
  }

  if (key === '+' || key === '-' || key === '*' || key === '/') {
    const current = Number(state.display);
    let acc = current;
    if (state.op !== null && state.acc !== null && !state.overwrite) {
      acc = apply(state.acc, state.op, current);
    } else if (state.acc !== null && state.overwrite) {
      acc = state.acc;
    }
    return { display: fmt(acc), acc, op: key, overwrite: true };
  }

  if (key === '=') {
    if (state.op !== null && state.acc !== null) {
      const r = apply(state.acc, state.op, Number(state.display));
      return { display: fmt(r), acc: null, op: null, overwrite: true };
    }
    return state;
  }

  return state;
}

export function run(keys: string[], state: CalcState = initialCalc): CalcState {
  return keys.reduce(pressKey, state);
}
