import { DOMAIN_LABELS, type Student } from './roster';
import type { Subject } from '../nextera/tools';

export interface DomainSelectProps {
  student: Student;
  onSelect: (domain: Subject) => void;
}

/** After sign-in the student picks which subject domain to enter. Only the
 * domains they are rostered for are offered (see Student.domains). */
export function DomainSelect({ student, onSelect }: DomainSelectProps) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <h1>Welcome, {student.firstName}</h1>
      <p>Choose your test.</p>
      <div role="list">
        {student.domains.map((domain) => (
          <button key={domain} type="button" onClick={() => onSelect(domain)}>
            {DOMAIN_LABELS[domain]}
          </button>
        ))}
      </div>
    </main>
  );
}
