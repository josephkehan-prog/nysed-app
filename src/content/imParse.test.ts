import { describe, it, expect } from 'vitest';
import { parseImTask } from './imParse';

// Representative pdftotext output for an IM task (structure matches the corpus).
const PAINTING_A_BARN = `
           Illustrative
           Mathematics
6.G Painting a Barn
Alignments to Content Standards: 6.G.A 6.RP.A.3
Task
Alexis needs to paint the four exterior walls of a large rectangular barn. The length of
the barn is 80 feet, the width is 50 feet, and the height is 30 feet. How much will it
cost Alexis to paint the barn? Explain your work.
IM Commentary
The purpose of this task is to provide students an opportunity to use mathematics
addressed in different standards in the same problem.
Solution
First Alexis needs to find the area she needs to paint.
2 x 30 feet x 50 feet = 3000 square feet
                                                                 1
           Illustrative
           Mathematics
https://www.illustrativemathematics.org
`;

describe('parseImTask', () => {
  const mod = parseImTask(PAINTING_A_BARN, 'public_task_135')!;

  it('parses the title without the leading cluster code', () => {
    expect(mod).not.toBeNull();
    expect(mod.meta.title).toBe('Painting a Barn');
    expect(mod.meta.id).toBe('painting-a-barn');
  });

  it('extracts the aligned standards and derives the cluster', () => {
    expect(mod.meta.standards).toEqual(['6.G.A', '6.RP.A.3']);
    expect(mod.meta.cluster).toBe('6.G');
  });

  it('captures the Task stem (and stops before IM Commentary)', () => {
    expect(mod.items[0].stem).toContain('paint the four exterior walls');
    expect(mod.items[0].stem).not.toContain('purpose of this task');
  });

  it('captures the worked solution and strips page/footer noise', () => {
    expect(mod.items[0].workedSolution).toContain('3000 square feet');
    expect(mod.items[0].workedSolution).not.toContain('Illustrative');
    expect(mod.items[0].workedSolution).not.toContain('illustrativemathematics.org');
  });

  it('is an explore module with IM attribution', () => {
    expect(mod.meta.kind).toBe('explore');
    expect(mod.meta.domain).toBe('math');
    expect(mod.meta.source.name).toBe('Illustrative Mathematics');
    expect(mod.items[0].answer).toBeUndefined();
  });

  it('returns null when there is no Task section', () => {
    expect(parseImTask('Some unrelated PDF text with no sections.', 'x')).toBeNull();
  });
});
