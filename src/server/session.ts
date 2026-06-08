// Practice/test "delivery": deterministically assemble a session of items for a
// target standard. Pure function so it is fully testable without I/O.

export interface PracticeItem {
  id: string;
  standard: string;
}

export function buildPracticeSession<T extends PracticeItem>(
  items: T[],
  standard: string,
  count: number,
): T[] {
  return items.filter((i) => i.standard === standard).slice(0, Math.max(0, count));
}
