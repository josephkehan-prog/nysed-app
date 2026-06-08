// NYSED Nextera student sign-in. Students authenticate with the Username printed
// on their login ticket plus the Session Access Code the proctor reads aloud. We
// validate locally against a mock roster — there is no network call.
import type { Subject } from '../nextera/tools';

export interface Student {
  username: string;
  firstName: string;
  lastName: string;
  grade: number;
  /** Subject domains this student is rostered to test in (e.g. math, ela). */
  domains: Subject[];
}

/** A roster row pairs a Student with the secret needed to sign in as them. */
export interface RosterEntry extends Student {
  sessionAccessCode: string;
}

export type Roster = RosterEntry[];

export type AuthResult =
  | { ok: true; student: Student }
  | { ok: false; error: string };

/** Stand-in for the proctor's printed roster; no backend exists for this app. */
export const MOCK_ROSTER: Roster = [
  {
    username: 'jdoe6',
    sessionAccessCode: 'MATH-2026',
    firstName: 'Jordan',
    lastName: 'Doe',
    grade: 6,
    domains: ['math', 'ela'],
  },
  {
    username: 'asmith4',
    sessionAccessCode: 'TEST-4A',
    firstName: 'Avery',
    lastName: 'Smith',
    grade: 4,
    domains: ['math'],
  },
  {
    username: 'rlee8',
    sessionAccessCode: 'ELA-8B',
    firstName: 'Riley',
    lastName: 'Lee',
    grade: 8,
    domains: ['ela', 'math'],
  },
];

// RED stub — replaced once the reproducer tests are confirmed failing.
export function authenticate(
  _roster: Roster,
  _username: string,
  _sessionAccessCode: string,
): AuthResult {
  return { ok: false, error: 'not implemented' };
}
