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

export function portalReducer(state: PortalState, action: PortalAction): PortalState {
  switch (action.type) {
    case 'login': {
      const result = authenticate(MOCK_ROSTER, action.username, action.sessionAccessCode);
      if (!result.ok) {
        return { step: 'login', student: null, domain: null, error: result.error };
      }
      return { step: 'domain', student: result.student, domain: null, error: null };
    }
    case 'select-domain':
      // A domain can only be chosen after a student has signed in.
      if (!state.student) return state;
      return { ...state, step: 'test', domain: action.domain, error: null };
    case 'sign-out':
      return initialPortalState;
    default:
      return state;
  }
}
