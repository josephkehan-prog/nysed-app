import { lazy, Suspense } from 'react';
import { Toolbar } from './nextera/Toolbar';
import { Calculator } from './components/Calculator';
import { MathText } from './components/MathText';
import { AccommodationsBar } from './components/AccommodationsBar';

// Heavy tool libraries (Excalidraw, Mafs, Tiptap, MathLive) are code-split so the
// app shell paints first instead of shipping one multi-MB bundle.
const GraphPlot = lazy(() => import('./components/GraphPlot').then((m) => ({ default: m.GraphPlot })));
const MathField = lazy(() => import('./components/MathField').then((m) => ({ default: m.MathField })));
const WritingSpace = lazy(() =>
  import('./components/WritingSpace').then((m) => ({ default: m.WritingSpace })),
);
const ScratchPad = lazy(() => import('./components/ScratchPad').then((m) => ({ default: m.ScratchPad })));

function Loading() {
  return <p>Loading…</p>;
}

/** Nextera-style practice shell wiring the expansive tool suite together. */
export function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1>NYSED Test Prep</h1>
      <AccommodationsBar />
      <Toolbar grade={6} session={2} />

      <section>
        <h2>Question</h2>
        <p>
          What is <MathText tex="\frac{1}{2} + \frac{1}{4}" />?
        </p>
      </section>

      <section>
        <h2>Graphing</h2>
        <Suspense fallback={<Loading />}>
          <GraphPlot />
        </Suspense>
      </section>

      <section>
        <h2>Equation entry</h2>
        <Suspense fallback={<Loading />}>
          <MathField />
        </Suspense>
      </section>

      <section>
        <h2>Writing space</h2>
        <Suspense fallback={<Loading />}>
          <WritingSpace />
        </Suspense>
      </section>

      <section>
        <h2>Scratch paper</h2>
        <Suspense fallback={<Loading />}>
          <ScratchPad />
        </Suspense>
      </section>

      <section>
        <h2>Calculator</h2>
        <Calculator />
      </section>
    </main>
  );
}
