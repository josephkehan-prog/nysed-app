// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LoginPortal } from './LoginPortal';

afterEach(cleanup);

describe('LoginPortal', () => {
  it('renders username + session access code fields and a Sign In button', () => {
    render(<LoginPortal onSubmit={() => {}} />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/session access code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('submits the entered username and access code', () => {
    const onSubmit = vi.fn();
    render(<LoginPortal onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'jdoe6' } });
    fireEvent.change(screen.getByLabelText(/session access code/i), {
      target: { value: 'MATH-2026' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(onSubmit).toHaveBeenCalledWith('jdoe6', 'MATH-2026');
  });

  it('shows an error alert when an error is provided', () => {
    render(
      <LoginPortal onSubmit={() => {}} error="Username or session access code is incorrect." />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/incorrect/i);
  });

  it('shows no error alert when there is no error', () => {
    render(<LoginPortal onSubmit={() => {}} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
