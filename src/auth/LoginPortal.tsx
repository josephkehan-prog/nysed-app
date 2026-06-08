import { useState, type FormEvent } from 'react';

export interface LoginPortalProps {
  onSubmit: (username: string, sessionAccessCode: string) => void;
  error?: string | null;
}

/** Nextera-style student sign-in: username from the login ticket + the session
 * access code read aloud by the proctor. Validation lives in authenticate(); this
 * component only collects and forwards the two fields. */
export function LoginPortal({ onSubmit, error }: LoginPortalProps) {
  const [username, setUsername] = useState('');
  const [sessionAccessCode, setSessionAccessCode] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(username, sessionAccessCode);
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <h1>New York State Testing</h1>
      <form onSubmit={handleSubmit} aria-label="Student sign in">
        <p>
          <label htmlFor="username">Username</label>
          <br />
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </p>
        <p>
          <label htmlFor="session-access-code">Session Access Code</label>
          <br />
          <input
            id="session-access-code"
            name="session-access-code"
            value={sessionAccessCode}
            onChange={(e) => setSessionAccessCode(e.target.value)}
          />
        </p>
        {error ? (
          <p role="alert" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}
        <button type="submit">Sign In</button>
      </form>
    </main>
  );
}
