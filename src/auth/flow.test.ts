import { describe, it, expect } from 'vitest';
import { portalReducer, initialPortalState } from './flow';
import { MOCK_ROSTER } from './roster';

const valid = MOCK_ROSTER[0];

describe('portalReducer — login → domain → test flow', () => {
  it('starts on the login step with no student', () => {
    expect(initialPortalState.step).toBe('login');
    expect(initialPortalState.student).toBeNull();
  });

  it('advances to domain selection after a successful login', () => {
    const next = portalReducer(initialPortalState, {
      type: 'login',
      username: valid.username,
      sessionAccessCode: valid.sessionAccessCode,
    });
    expect(next.step).toBe('domain');
    expect(next.student?.firstName).toBe(valid.firstName);
    expect(next.error).toBeNull();
  });

  it('stays on login and surfaces an error after a failed login', () => {
    const next = portalReducer(initialPortalState, {
      type: 'login',
      username: valid.username,
      sessionAccessCode: 'WRONG',
    });
    expect(next.step).toBe('login');
    expect(next.student).toBeNull();
    expect(next.error).toMatch(/incorrect/i);
  });

  it('advances to the test step once a domain is selected', () => {
    const afterLogin = portalReducer(initialPortalState, {
      type: 'login',
      username: valid.username,
      sessionAccessCode: valid.sessionAccessCode,
    });
    const afterDomain = portalReducer(afterLogin, { type: 'select-domain', domain: 'math' });
    expect(afterDomain.step).toBe('test');
    expect(afterDomain.domain).toBe('math');
    expect(afterDomain.student?.firstName).toBe(valid.firstName);
  });

  it('ignores domain selection before a student has signed in', () => {
    const next = portalReducer(initialPortalState, { type: 'select-domain', domain: 'math' });
    expect(next.step).toBe('login');
    expect(next.domain).toBeNull();
  });

  it('returns to the initial login state on sign-out', () => {
    const afterLogin = portalReducer(initialPortalState, {
      type: 'login',
      username: valid.username,
      sessionAccessCode: valid.sessionAccessCode,
    });
    const out = portalReducer(afterLogin, { type: 'sign-out' });
    expect(out).toEqual(initialPortalState);
  });
});
