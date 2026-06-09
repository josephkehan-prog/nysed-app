// Pure parser: Illustrative Mathematics task text (from pdftotext) -> LearningModule.
// IM tasks follow a consistent layout: [title] / "Alignments to Content Standards: …"
// / "Task" / "IM Commentary" / "Solution(s)". They are open constructed-response, so
// they become 'explore' modules (stem + worked-solution reveal), not auto-scored.
import type { LearningModule } from '../modules/types';

const SECTION = /^\s*(Task|Solutions?|IM Commentary)\s*$/;

const IM_SOURCE = {
  name: 'Illustrative Mathematics',
  license: 'CC BY-NC-SA 4.0',
  attribution: 'Illustrative Mathematics, illustrativemathematics.org',
  url: 'https://www.illustrativemathematics.org',
} as const;

function isNoise(line: string): boolean {
  const t = line.trim();
  return (
    t === '' ||
    /^(Illustrative|Mathematics)$/i.test(t) ||
    /^\d+$/.test(t) || // page number
    /^Typeset/i.test(t) ||
    /^Edit this solution$/i.test(t) ||
    /illustrativemathematics\.org/i.test(t) ||
    /Creative Commons/i.test(t) ||
    /International License/i.test(t) ||
    /^https?:\/\//i.test(t)
  );
}

/** Text from the line after `startRe` up to `stopRe` (or end), noise-filtered. */
function sectionText(lines: string[], startRe: RegExp, stopRe: RegExp | null): string {
  const start = lines.findIndex((l) => startRe.test(l));
  if (start < 0) return '';
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (stopRe && stopRe.test(lines[i])) break;
    if (!isNoise(lines[i])) out.push(lines[i].trim());
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

function clusterFromStandards(standards: string[]): string {
  if (standards.length === 0) return '';
  return standards[0].split('.').slice(0, 2).join('.'); // '6.G.A.2' -> '6.G'
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseImTask(rawText: string, fallbackId: string): LearningModule | null {
  const lines = rawText.split(/\r?\n/);

  // Standards from the alignments line.
  const alignIdx = lines.findIndex((l) => /Alignments to Content Standards/i.test(l));
  let standards: string[] = [];
  if (alignIdx >= 0) {
    const after = lines[alignIdx].split(/Standards:\s*/i)[1] ?? '';
    standards = after
      .trim()
      .split(/\s+/)
      .filter((s) => /^\d+\.[A-Za-z0-9.]+$/.test(s));
  }

  // Title = first meaningful line from the top (skipping the IM header / sections).
  let titleRaw = '';
  for (const l of lines) {
    const t = l.trim();
    if (isNoise(t) || SECTION.test(t) || /Alignments to Content Standards/i.test(t)) continue;
    titleRaw = t;
    break;
  }
  const m = titleRaw.match(/^(\d+\.[A-Z]+)\s+(.+)$/); // strip leading cluster code
  const titleCluster = m ? m[1] : '';
  const title = (m ? m[2] : titleRaw).trim();

  // Remove the running page header (the repeated "<cluster> <title>" line).
  const strip = (s: string) =>
    titleRaw ? s.split(titleRaw).join(' ').replace(/\s+/g, ' ').trim() : s;

  const stem = strip(sectionText(lines, /^\s*Task\s*$/, SECTION));
  if (!stem) return null; // not an IM task in the expected format

  const solution = strip(sectionText(lines, /^\s*Solutions?\s*$/, null));
  const cluster = clusterFromStandards(standards) || titleCluster || 'Grade 6';

  return {
    meta: {
      id: slug(title || fallbackId),
      domain: 'math',
      cluster,
      standards,
      title: title || fallbackId,
      kind: 'explore',
      source: { ...IM_SOURCE },
    },
    items: [
      {
        stem,
        interactionType: 'text',
        ...(solution ? { workedSolution: solution } : {}),
      },
    ],
  };
}
