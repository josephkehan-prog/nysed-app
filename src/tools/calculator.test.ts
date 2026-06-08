import { describe, it, expect } from 'vitest';
import { run } from './calculator';

const display = (keys: string[]) => run(keys).display;

describe('calculator engine', () => {
  it('adds', () => expect(display(['1', '+', '2', '='])).toBe('3'));
  it('subtracts', () => expect(display(['7', '-', '2', '='])).toBe('5'));
  it('multiplies', () => expect(display(['4', '*', '5', '='])).toBe('20'));
  it('divides', () => expect(display(['8', '/', '2', '='])).toBe('4'));

  it('chains operations', () => {
    expect(display(['1', '+', '2', '+', '3', '='])).toBe('6');
  });

  it('handles multi-digit entry', () => {
    expect(display(['1', '2', '+', '3', '4', '='])).toBe('46');
  });

  it('handles decimals', () => {
    expect(display(['1', '.', '5', '+', '2', '='])).toBe('3.5');
  });

  it('computes square root', () => {
    expect(display(['9', 'sqrt'])).toBe('3');
    expect(display(['4', 'sqrt'])).toBe('2');
  });

  it('clears', () => {
    expect(display(['5', '+', '3', 'C'])).toBe('0');
  });

  it('reports Error on divide by zero', () => {
    expect(display(['5', '/', '0', '='])).toBe('Error');
  });

  it('reports Error on square root of a negative', () => {
    expect(display(['9', '-', '1', '6', '=', 'sqrt'])).toBe('Error');
  });
});
