import { FormEvent, useState } from 'react';
import Button from '../../../components/common/Button';
export interface RegisterIndividualPasswordData {
  password: string;
}
interface RegisterIndividualPasswordStepProps {
  isLoading: boolean;
  onSubmit: (data: RegisterIndividualPasswordData) => void;
  onBack?: () => void;
}

function RegisterIndividualPasswordStep({
  isLoading,
  onSubmit,
  onBack,
}: RegisterIndividualPasswordStepProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    onSubmit({ password });
  };
  return (
    <form onSubmit={handleSubmit} className="partner-register-form">
      <p className="partner-form-section-title">Create your password</p>
      <div className="partner-form-group">
        <label htmlFor="individualPassword">Password</label>
        <input
          id="individualPassword"
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setError('');
          }}
          placeholder="Enter your password"
          disabled={isLoading}
        />
      </div>
      <div className="partner-form-group">
        <label htmlFor="individualConfirmPassword">Confirm password</label>
        <input
          id="individualConfirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
            setError('');
          }}
          placeholder="Confirm your password"
          disabled={isLoading}
        />
      </div>
      {error && <span className="partner-error-message">{error}</span>}
      <div className="partner-form-actions">
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Continue
        </Button>
        {onBack && (
          <button
            type="button"
            className="partner-back-link"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </button>
        )}
      </div>
    </form>
  );
}

export default RegisterIndividualPasswordStep;
