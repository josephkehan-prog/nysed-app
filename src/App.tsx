import { useEffect, useMemo, useReducer, useState } from 'react';
import { LoginPortal } from './auth/LoginPortal';
import { DomainSelect } from './auth/DomainSelect';
import { portalReducer, initialPortalState } from './auth/flow';
import { DOMAIN_LABELS, type Student } from './auth/roster';
import { ModuleCatalog } from './modules/ModuleCatalog';
import { ModulePlayer } from './modules/ModulePlayer';
import { MasterySummary } from './modules/MasterySummary';
import { PracticeSession } from './modules/PracticeSession';
import { buildPracticeSession, buildReviewSession } from './modules/session';
import { loadModules } from './modules/registry';
import { AccommodationsBar } from './components/AccommodationsBar';
import { AccommodationsProvider, useAccommodations } from './a11y/AccommodationsContext';
import { createLocalProgressStore } from './progress/store';
import type { LearningModule } from './modules/types';
import type { Subject } from './nextera/tools';

interface DomainHomeProps {
  domain: Subject;
  student: Student;
  onSignOut: () => void;
}

/** A domain's home: browse the module catalog (with per-cluster progress), play a
 * chosen module, and persist attempts/visits to the local ProgressStore. The
 * AccommodationsProvider scopes accommodations to this signed-in session. */
function DomainHome(props: DomainHomeProps) {
  return (
    <AccommodationsProvider>
      <DomainHomeBody {...props} />
    </AccommodationsProvider>
  );
}

function DomainHomeBody({ domain, student, onSignOut }: DomainHomeProps) {
  const { state: accommodations } = useAccommodations();
  const store = useMemo(() => createLocalProgressStore(), []);
  const studentId = student.username;
  const [selected, setSelected] = useState<LearningModule | null>(null);
  // Bumped whenever progress is written, so the catalog/mastery views refresh.
  const [version, setVersion] = useState(0);

  const engagedIds = useMemo(
    () => store.engagedModuleIds(studentId),
    [store, studentId, version],
  );
  const mastery = useMemo(() => store.masteryByStandard(studentId), [store, studentId, version]);

  // Modules for this domain, loaded once, used to build a practice session.
  const [modules, setModules] = useState<LearningModule[]>([]);
  useEffect(() => {
    let live = true;
    loadModules(domain).then((m) => {
      if (live) setModules(m);
    });
    return () => {
      live = false;
    };
  }, [domain]);
  const practice = useMemo(() => buildPracticeSession(modules), [modules]);
  const review = useMemo(() => buildReviewSession(modules, mastery), [modules, mastery]);
  // The active session's modules (practice or review), or null when browsing.
  const [session, setSession] = useState<LearningModule[] | null>(null);

  const recordAttempt = (moduleId: string, standard: string, score: { score: number; maxScore: number }) =>
    store.recordAttempt({ studentId, moduleId, standard, score: score.score, maxScore: score.maxScore });

  const contrast = accommodations.reverseContrast
    ? { background: '#000', color: '#fff' }
    : undefined;

  return (
    <main
      style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 16, ...contrast }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1>{DOMAIN_LABELS[domain]}</h1>
        <span>
          {student.firstName}{' '}
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </span>
      </header>
      <AccommodationsBar />
      {session ? (
        <PracticeSession
          modules={session}
          onRecord={recordAttempt}
          onExit={() => {
            setSession(null);
            setVersion((v) => v + 1);
          }}
        />
      ) : selected ? (
        <ModulePlayer
          module={selected}
          onExit={() => setSelected(null)}
          onScored={(s) => {
            recordAttempt(selected.meta.id, selected.meta.standards[0] ?? selected.meta.cluster, s);
            setVersion((v) => v + 1);
          }}
          onVisited={() => {
            store.markVisited(studentId, selected.meta.id);
            setVersion((v) => v + 1);
          }}
        />
      ) : (
        <>
          <MasterySummary mastery={mastery} />
          <p style={{ display: 'flex', gap: 8 }}>
            <button type="button" disabled={practice.length === 0} onClick={() => setSession(practice)}>
              {practice.length > 0 ? `Start practice (${practice.length})` : 'Start practice'}
            </button>
            <button type="button" disabled={review.length === 0} onClick={() => setSession(review)}>
              Review weak spots
            </button>
          </p>
          <ModuleCatalog domain={domain} onOpen={setSelected} engagedIds={engagedIds} />
        </>
      )}
    </main>
  );
}

/** Drives the flow: login → choose a subject domain → that domain's modules. */
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
      <DomainHome
        domain={state.domain}
        student={state.student}
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
