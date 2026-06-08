// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { DomainSelect } from './DomainSelect';
import type { Student } from './roster';

afterEach(cleanup);

const student: Student = {
  username: 'jdoe6',
  firstName: 'Jordan',
  lastName: 'Doe',
  grade: 6,
  domains: ['math', 'ela'],
};

describe('DomainSelect', () => {
  it('greets the student by first name', () => {
    render(<DomainSelect student={student} onSelect={() => {}} />);
    expect(screen.getByText(/welcome, jordan/i)).toBeInTheDocument();
  });

  it('renders a button for each rostered domain', () => {
    render(<DomainSelect student={student} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /mathematics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /english language arts/i })).toBeInTheDocument();
  });

  it('calls onSelect with the chosen domain', () => {
    const onSelect = vi.fn();
    render(<DomainSelect student={student} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /mathematics/i }));
    expect(onSelect).toHaveBeenCalledWith('math');
  });

  it('only shows domains the student is rostered for', () => {
    const mathOnly: Student = { ...student, domains: ['math'] };
    render(<DomainSelect student={mathOnly} onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /mathematics/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /english language arts/i }),
    ).not.toBeInTheDocument();
  });
});
