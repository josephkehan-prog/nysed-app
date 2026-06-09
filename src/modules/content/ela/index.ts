/// <reference types="vite/client" />
import type { LearningModule } from '../../types';

// Auto-discovers every ELA reading module JSON in this directory.
const loaded = import.meta.glob('./*.json', { eager: true, import: 'default' });
export const modules: LearningModule[] = Object.values(loaded) as LearningModule[];
