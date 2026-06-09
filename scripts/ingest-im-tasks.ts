// Build-time ingest: Illustrative Math task PDFs -> module JSON.
// Run with: node scripts/ingest-im-tasks.ts
// Requires `pdftotext` (poppler) on PATH. Generated JSON is committed.
import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parseImTask } from '../src/content/imParse.ts';

const SRC =
  process.env.IM_PDF_DIR ??
  'C:/Users/19172/Desktop/Project/AchieveTheCore_CoherenceMap_Grade6_PDFs';
const OUT = 'src/modules/content/math';

mkdirSync(OUT, { recursive: true });

const pdfs = readdirSync(SRC).filter((f) => /^public_task_.*\.pdf$/.test(f));
let written = 0;
let skipped = 0;

for (const f of pdfs) {
  let text: string;
  try {
    text = execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', join(SRC, f), '-'], {
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (e) {
    console.log('FAIL', f, (e as Error).message);
    skipped++;
    continue;
  }
  const mod = parseImTask(text, basename(f, '.pdf'));
  if (!mod) {
    console.log('SKIP', f, '(no Task section)');
    skipped++;
    continue;
  }
  writeFileSync(join(OUT, `${mod.meta.id}.json`), JSON.stringify(mod, null, 2) + '\n');
  written++;
  console.log('OK  ', f, '->', `${mod.meta.id}.json`, `[${mod.meta.standards.join(', ')}]`);
}

console.log(`\n${written} module(s) written, ${skipped} skipped.`);
