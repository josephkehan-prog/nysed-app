import { lazy, Suspense, useReducer } from 'react';
import { Toolbar } from './nextera/Toolbar';
import { Calculator } from './components/Calculator';
import { MathText } from './components/MathText';
import { AccommodationsBar } from './components/AccommodationsBar';
import { LoginPortal } from './auth/LoginPortal';
import { DomainSelect } from './auth/DomainSelect';
import { portalReducer, initialPortalState } from './auth/flow';
import { DOMAIN_LABELS } from './auth/roster';
import type { Subject } from './nextera/tools';

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

interface TestShellProps {
  studentName: string;
  grade: number;
  subject: Subject;
  onSignOut: () => void;
}

/** The Nextera-style practice shell, entered only after sign-in and domain
 * selection. Tool availability follows the chosen grade/subject. */
function TestShell({ studentName, grade, subject, onSignOut }: TestShellProps) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1>NYSED Test Prep</h1>
        <span>
          {studentName} · Grade {grade} · {DOMAIN_LABELS[subject]}{' '}
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </span>
      </header>
      <AccommodationsBar />
      <Toolbar grade={grade} session={2} subject={subject} />

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

/** Drives the sign-in flow: login → pick a subject domain → the test shell. */
export function App() {
  const [state, dispatch] = useReducer(portalReducer, initialPortalState);

  if (state.step === 'domain' && state.student) {
    return (
      <DomainSelect
        student={state.student}
        onSelect={(domain) => dispatch({ type: 'select-domain', domain })}
      />
    );
  }

  if (state.step === 'test' && state.student && state.domain) {
    return (
      <TestShell
        studentName={state.student.firstName}
        grade={state.student.grade}
        subject={state.domain}
        onSignOut={() => dispatch({ type: 'sign-out' })}
      />
    );
  }

  return (
    <LoginPortal
      error={state.error}
      onSubmit={(username, sessionAccessCode) =>
        dispatch({ type: 'login', username, sessionAccessCode })
      }
    />
  );
}
