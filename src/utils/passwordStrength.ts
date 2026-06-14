export interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  symbol: boolean;
}

export interface PasswordStrengthResult {
  checks: PasswordChecks;
  score: number;
  label: string;
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  const checks: PasswordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  let label = 'Weak';

  if (score === 2) {
    label = 'Fair';
  } else if (score === 3) {
    label = 'Fair';
  } else if (score === 4) {
    label = 'Good';
  }

  return { checks, score, label };
}

export function isPasswordStrongEnough(password: string): boolean {
  const { checks } = getPasswordStrength(password);
  return (
    checks.length && checks.uppercase && checks.number && checks.symbol
  );
}
