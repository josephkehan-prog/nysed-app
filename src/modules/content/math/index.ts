// Hand-written sample module. The P1 ingestion pipeline will generate the real
// Grade 6 modules from the Illustrative Math task PDFs into this directory.
import type { LearningModule } from '../../types';

export const modules: LearningModule[] = [
  {
    meta: {
      id: 'sample-unit-rate',
      domain: 'math',
      cluster: '6.RP',
      standards: ['6.RP.A.2', '6.RP.A.3'],
      title: 'Unit Rate',
      kind: 'practice',
      source: { name: 'Platform sample', license: 'CC BY 4.0', attribution: 'Platform sample' },
    },
    items: [
      {
        stem: 'A car travels 120 miles in 3 hours. What is its speed, in miles per hour?',
        interactionType: 'numeric',
        config: { unit: 'mph' },
        answer: { type: 'numeric', value: 40 },
        workedSolution: '120 miles ÷ 3 hours = 40 miles per hour.',
      },
    ],
  },
];
