import { FormEvent, useState } from 'react';
import InfoHint from '../../../components/common/InfoHint';
import Button from '../../../components/common/Button';
import type { PartnerType } from '../../../types/partner';

export interface VerifyOtpFormData {
  firstName: string;
  lastName: string;
  otp: string;
}

interface VerifyOtpStepProps {
  email: string;
  isLoading: boolean;
  variant?: PartnerType;
  onVerify: (data: VerifyOtpFormData) => void;
  onBack?: () => void;
}

function VerifyOtpStep({
  email,
  isLoading,
  variant = 'organization',
  onVerify,
  onBack,
}: VerifyOtpStepProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the verification OTP');
      return;
    }

    onVerify({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      otp: otp.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="partner-register-form">
      <p className="partner-form-section-title">Verify your account</p>
      <p
        className="partner-register-step"
        style={{ marginTop: '-16px', marginBottom: '16px' }}
      >
        OTP sent to {email}
      </p>

      {variant === 'organization' && (
        <>
          <div className="partner-form-group">
            <label htmlFor="firstName">
              First name
              <InfoHint message="If not provided, a default name will be added" />
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={e => {
                setFirstName(e.target.value);
                setError('');
              }}
              placeholder="First name (optional)"
              disabled={isLoading}
            />
          </div>

          <div className="partner-form-group">
            <label htmlFor="lastName">
              Last name
              <InfoHint message="If not provided, a default name will be added" />
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={e => {
                setLastName(e.target.value);
                setError('');
              }}
              placeholder="Last name (optional)"
              disabled={isLoading}
            />
          </div>
        </>
      )}

      <div className="partner-form-group">
        <label htmlFor="otp">Verify OTP</label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={e => {
            setOtp(e.target.value);
            setError('');
          }}
          placeholder="Enter OTP"
          disabled={isLoading}
          className={error && !otp.trim() ? 'input-error' : ''}
        />
      </div>

      {error && <span className="partner-error-message">{error}</span>}

      <div className="partner-form-actions">
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Verify OTP
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

export default VerifyOtpStep;
