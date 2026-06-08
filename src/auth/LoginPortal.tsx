import { useState, type FormEvent } from 'react';

export interface LoginPortalProps {
  onSubmit: (username: string, sessionAccessCode: string) => void;
  error?: string | null;
}

// RED stub — real sign-in form added once the reproducer tests are failing.
export function LoginPortal(_props: LoginPortalProps) {
  void useState;
  void ((_e: FormEvent) => {});
  return <main />;
}
