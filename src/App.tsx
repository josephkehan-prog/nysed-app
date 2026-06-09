import { useMemo, useReducer, useState } from 'react';
import { LoginPortal } from './auth/LoginPortal';
import { DomainSelect } from './auth/DomainSelect';
import { portalReducer, initialPortalState } from './auth/flow';
import { DOMAIN_LABELS, type Student } from './auth/roster';
import { ModuleCatalog } from './modules/ModuleCatalog';
import { ModulePlayer } from './modules/ModulePlayer';
import { MasterySummary } from './modules/MasterySummary';
import { createLocalProgressStore } from './progress/store';
import type { LearningModule } from './modules/types';
import type { Subject } from './nextera/tools';

interface DomainHomeProps {
  domain: Subject;
  student: Student;
  onSignOut: () => void;
}

/** A domain's home: browse the module catalog (with per-cluster progress), play a
 * chosen module, and persist attempts/visits to the local ProgressStore. */
function DomainHome({ domain, student, onSignOut }: DomainHomeProps) {
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

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1>{DOMAIN_LABELS[domain]}</h1>
        <span>
          {student.firstName}{' '}
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </span>
      </header>
      {selected ? (
        <ModulePlayer
          module={selected}
          onExit={() => setSelected(null)}
          onScored={(s) => {
            store.recordAttempt({
              studentId,
              moduleId: selected.meta.id,
              standard: selected.meta.standards[0] ?? selected.meta.cluster,
              score: s.score,
              maxScore: s.maxScore,
            });
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
