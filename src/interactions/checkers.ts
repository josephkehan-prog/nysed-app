// Deterministic checkers for student-constructed ("drawn") answers.
// Each interaction widget emits a STRUCTURED answer object; we compare the
// data (coordinates, sets, series), never pixels — so grading is deterministic.

export interface Point {
  x: number;
  y: number;
}

function approxEqual(a: number, b: number, tolerance: number): boolean {
  return Math.abs(a - b) <= tolerance;
}

/** Order-independent match of plotted points, within an absolute tolerance. */
export function pointsMatch(response: Point[], expected: Point[], tolerance = 0): boolean {
  if (response.length !== expected.length) return false;
  const remaining = [...expected];
  for (const p of response) {
    const idx = remaining.findIndex(
      (e) => approxEqual(p.x, e.x, tolerance) && approxEqual(p.y, e.y, tolerance),
    );
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }
  return true;
}

/** A single value placed on a number line, within tolerance. */
export function numberLineMatch(value: number, expected: number, tolerance = 0): boolean {
  return approxEqual(value, expected, tolerance);
}

/** Which cells/parts a student shaded (e.g. fraction model): set equality, order-independent. */
export function shadedRegionMatch(response: number[], expected: number[]): boolean {
  const r = new Set(response);
  const e = new Set(expected);
  if (r.size !== e.size) return false;
  for (const v of e) if (!r.has(v)) return false;
  return true;
}

/** Equivalent-fraction check by shaded count over total parts (e.g. 2/4 == 1/2). */
export function shadedFractionEquivalent(
  shadedCount: number,
  totalParts: number,
  expectedNumerator: number,
  expectedDenominator: number,
): boolean {
  if (totalParts === 0 || expectedDenominator === 0) return false;
  // a/b == c/d  <=>  a*d == c*b
  return shadedCount * expectedDenominator === expectedNumerator * totalParts;
}

/** Bar-graph / series answer: positional values within tolerance. */
export function barsMatch(response: number[], expected: number[], tolerance = 0): boolean {
  if (response.length !== expected.length) return false;
  return response.every((v, i) => approxEqual(v, expected[i], tolerance));
}
