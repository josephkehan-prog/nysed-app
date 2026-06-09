import { useReducer, useState } from 'react';
import { LoginPortal } from './auth/LoginPortal';
import { DomainSelect } from './auth/DomainSelect';
import { portalReducer, initialPortalState } from './auth/flow';
import { DOMAIN_LABELS } from './auth/roster';
import { ModuleCatalog } from './modules/ModuleCatalog';
import { ModulePlayer } from './modules/ModulePlayer';
import type { LearningModule } from './modules/types';
import type { Subject } from './nextera/tools';

interface DomainHomeProps {
  domain: Subject;
  studentName: string;
  onSignOut: () => void;
}

/** A domain's home: browse the module catalog, then play a chosen module. */
function DomainHome({ domain, studentName, onSignOut }: DomainHomeProps) {
  const [selected, setSelected] = useState<LearningModule | null>(null);
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1>{DOMAIN_LABELS[domain]}</h1>
        <span>
          {studentName}{' '}
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </span>
      </header>
      {selected ? (
        <ModulePlayer module={selected} onExit={() => setSelected(null)} />
      ) : (
        <ModuleCatalog domain={domain} onOpen={setSelected} />
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
        studentName={state.student.firstName}
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
