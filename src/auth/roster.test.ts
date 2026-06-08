import { describe, it, expect } from 'vitest';
import { authenticate, MOCK_ROSTER } from './roster';

describe('authenticate — NYSED Nextera student sign-in', () => {
  const [first] = MOCK_ROSTER;

  it('accepts a valid username + session access code', () => {
    const result = authenticate(MOCK_ROSTER, first.username, first.sessionAccessCode);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.student.username).toBe(first.username);
      expect(result.student.firstName).toBe(first.firstName);
      expect(result.student.grade).toBe(first.grade);
      expect(result.student.domains).toEqual(first.domains);
    }
  });

  it('never exposes the session access code on the returned student', () => {
    const result = authenticate(MOCK_ROSTER, first.username, first.sessionAccessCode);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.student as unknown as Record<string, unknown>).sessionAccessCode).toBeUndefined();
    }
  });

  it('matches the username case-insensitively', () => {
    const result = authenticate(MOCK_ROSTER, first.username.toUpperCase(), first.sessionAccessCode);
    expect(result.ok).toBe(true);
  });

  it('trims surrounding whitespace on both fields', () => {
    const result = authenticate(
      MOCK_ROSTER,
      `  ${first.username}  `,
      `  ${first.sessionAccessCode}  `,
    );
    expect(result.ok).toBe(true);
  });

  it('rejects a wrong session access code with a generic error', () => {
    const result = authenticate(MOCK_ROSTER, first.username, 'WRONG-CODE');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/incorrect/i);
  });

  it('rejects an unknown username with the same generic error (no user enumeration)', () => {
    const wrongUser = authenticate(MOCK_ROSTER, 'nobody', first.sessionAccessCode);
    const wrongCode = authenticate(MOCK_ROSTER, first.username, 'WRONG-CODE');
    expect(wrongUser.ok).toBe(false);
    expect(wrongCode.ok).toBe(false);
    if (!wrongUser.ok && !wrongCode.ok) expect(wrongUser.error).toBe(wrongCode.error);
  });

  it('requires both fields to be non-empty', () => {
    expect(authenticate(MOCK_ROSTER, '', first.sessionAccessCode).ok).toBe(false);
    expect(authenticate(MOCK_ROSTER, first.username, '   ').ok).toBe(false);
  });

  it("does not let a student sign in with another student's code", () => {
    const other = MOCK_ROSTER[1];
    const result = authenticate(MOCK_ROSTER, first.username, other.sessionAccessCode);
    expect(result.ok).toBe(false);
  });
});
