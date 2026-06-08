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

/** Human-readable names for each subject domain, shown in the picker and header. */
export const DOMAIN_LABELS: Record<Subject, string> = {
  math: 'Mathematics',
  ela: 'English Language Arts',
};

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

/**
 * Look up a student by username (case-insensitive) and session access code.
 * Both fields are trimmed first. Unknown username and wrong code return the same
 * generic message so the form can't be used to enumerate valid usernames. The
 * returned Student never carries the access code.
 */
export function authenticate(
  roster: Roster,
  username: string,
  sessionAccessCode: string,
): AuthResult {
  const user = username.trim();
  const code = sessionAccessCode.trim();
  if (!user || !code) {
    return { ok: false, error: 'Enter your username and session access code.' };
  }
  const entry = roster.find(
    (e) => e.username.toLowerCase() === user.toLowerCase() && e.sessionAccessCode === code,
  );
  if (!entry) {
    return { ok: false, error: 'Username or session access code is incorrect.' };
  }
  const student: Student = {
    username: entry.username,
    firstName: entry.firstName,
    lastName: entry.lastName,
    grade: entry.grade,
    domains: entry.domains,
  };
  return { ok: true, student };
}
