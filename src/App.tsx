import { Toolbar } from './nextera/Toolbar';
import { Calculator } from './components/Calculator';
import { GraphPlot } from './components/GraphPlot';
import { MathText } from './components/MathText';
import { ScratchPad } from './components/ScratchPad';
import { WritingSpace } from './components/WritingSpace';
import { MathField } from './components/MathField';
import { AccommodationsBar } from './components/AccommodationsBar';

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
        <GraphPlot />
      </section>

      <section>
        <h2>Equation entry</h2>
        <MathField />
      </section>

      <section>
        <h2>Writing space</h2>
        <WritingSpace />
      </section>

      <section>
        <h2>Scratch paper</h2>
        <ScratchPad />
      </section>

      <section>
        <h2>Calculator</h2>
        <Calculator />
      </section>
    </main>
  );
}
