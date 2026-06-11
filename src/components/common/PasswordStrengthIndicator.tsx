import { Check } from 'lucide-react';
import { getPasswordStrength } from '../../utils/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
}

function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { checks, score, label } = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="password-strength">
      <div className="password-strength-bar" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className={`password-strength-segment${
              index < score ? ' password-strength-segment--active' : ''
            }`}
          />
        ))}
      </div>
      <p className="password-strength-label">
        Password strength: <strong>{label}</strong>
      </p>
      <ul className="password-strength-checks">
        <li className={checks.length ? 'password-strength-check--pass' : ''}>
          <Check size={12} />
          8+ characters
        </li>
        <li className={checks.uppercase ? 'password-strength-check--pass' : ''}>
          <Check size={12} />
          1 uppercase
        </li>
        <li className={checks.number ? 'password-strength-check--pass' : ''}>
          <Check size={12} />
          1 number
        </li>
      </ul>
    </div>
  );
}

export default PasswordStrengthIndicator;
