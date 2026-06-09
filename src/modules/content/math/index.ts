/// <reference types="vite/client" />
import type { LearningModule } from '../../types';

// Auto-discovers every module JSON in this directory: the hand-written sample plus
// whatever scripts/ingest-im-tasks.ts generates from the Illustrative Math PDFs.
const loaded = import.meta.glob('./*.json', { eager: true, import: 'default' });
export const modules: LearningModule[] = Object.values(loaded) as LearningModule[];
