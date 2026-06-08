import type { Student } from './roster';
import type { Subject } from '../nextera/tools';

export interface DomainSelectProps {
  student: Student;
  onSelect: (domain: Subject) => void;
}

// RED stub — real subject picker added once the reproducer tests are failing.
export function DomainSelect(_props: DomainSelectProps) {
  return <main />;
}
