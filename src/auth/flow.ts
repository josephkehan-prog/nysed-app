// Deterministic login → domain → test flow for the Nextera-style portal. Kept as
// a pure reducer (like the rest of this codebase) so the whole sequence is unit
// testable without a router or global store.
import { authenticate, MOCK_ROSTER, type Student } from './roster';
import type { Subject } from '../nextera/tools';

export type PortalStep = 'login' | 'domain' | 'test';

export interface PortalState {
  step: PortalStep;
  student: Student | null;
  /** The subject domain the student chose to enter. */
  domain: Subject | null;
  error: string | null;
}

export const initialPortalState: PortalState = {
  step: 'login',
  student: null,
  domain: null,
  error: null,
};

export type PortalAction =
  | { type: 'login'; username: string; sessionAccessCode: string }
  | { type: 'select-domain'; domain: Subject }
  | { type: 'sign-out' };

// RED stub — no transitions until the reproducer tests are confirmed failing.
export function portalReducer(state: PortalState, _action: PortalAction): PortalState {
  return state;
}

// Referenced so the stub file compiles with the same imports the real impl uses.
void authenticate;
void MOCK_ROSTER;
