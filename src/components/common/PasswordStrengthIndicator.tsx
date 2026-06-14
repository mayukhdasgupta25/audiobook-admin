import { Check } from 'lucide-react';
import { getPasswordStrength } from '../../utils/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface RequirementPillProps {
  label: string;
  met: boolean;
}

function RequirementPill({ label, met }: RequirementPillProps) {
  return (
    <span
      className={`password-requirement-pill${
        met ? ' password-requirement-pill--met' : ''
      }`}
      aria-label={`${label} requirement ${met ? 'met' : 'not met'}`}
    >
      {met && (
        <span className="password-requirement-pill__icon" aria-hidden="true">
          <Check size={10} strokeWidth={3} />
        </span>
      )}
      {label}
    </span>
  );
}

function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { checks } = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  const requirements = [
    { key: 'length', label: '8+ characters', met: checks.length },
    { key: 'uppercase', label: '1 uppercase letter', met: checks.uppercase },
    { key: 'number', label: '1 number', met: checks.number },
    { key: 'symbol', label: '1 symbol', met: checks.symbol },
  ] as const;

  return (
    <div className="password-requirements" aria-live="polite">
      {requirements.map(({ key, label, met }) => (
        <RequirementPill key={key} label={label} met={met} />
      ))}
    </div>
  );
}

export default PasswordStrengthIndicator;
