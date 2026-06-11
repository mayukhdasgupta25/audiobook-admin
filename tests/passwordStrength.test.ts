import { describe, it, expect } from 'vitest';
import {
  getPasswordStrength,
  isPasswordStrongEnough,
} from '../src/utils/passwordStrength';

describe('passwordStrength', () => {
  it('marks a strong password as good', () => {
    const result = getPasswordStrength('Secure1pass');
    expect(result.label).toBe('Good');
    expect(result.checks.length).toBe(true);
    expect(result.checks.uppercase).toBe(true);
    expect(result.checks.number).toBe(true);
  });

  it('requires all password rules before submit', () => {
    expect(isPasswordStrongEnough('short')).toBe(false);
    expect(isPasswordStrongEnough('alllowercase1')).toBe(false);
    expect(isPasswordStrongEnough('NoNumbers')).toBe(false);
    expect(isPasswordStrongEnough('Secure1pass')).toBe(true);
  });
});
