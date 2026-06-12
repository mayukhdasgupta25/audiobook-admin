import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/common/Button';
import FieldErrorHint from '../../../components/common/FieldErrorHint';
import InfoBanner from '../../../components/common/InfoBanner';
import PasswordStrengthIndicator from '../../../components/common/PasswordStrengthIndicator';
import type { IndividualPasswordData } from '../../../store/slices/partnerRegistrationSlice';
import { isPasswordStrongEnough } from '../../../utils/passwordStrength';

export interface RegisterIndividualPasswordData {
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

interface RegisterIndividualPasswordStepProps {
  isLoading: boolean;
  initialData?: IndividualPasswordData;
  onSubmit: (data: RegisterIndividualPasswordData) => void;
  onSaveDraft?: (data: RegisterIndividualPasswordData) => void;
  onBack?: () => void;
}

function RegisterIndividualPasswordStep({
  isLoading,
  initialData,
  onSubmit,
  onSaveDraft,
  onBack,
}: RegisterIndividualPasswordStepProps) {
  const [password, setPassword] = useState(initialData?.password ?? '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(
    initialData?.acceptedTerms ?? false
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setPassword(initialData?.password ?? '');
    setAcceptedTerms(initialData?.acceptedTerms ?? false);
  }, [initialData]);

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildFormData = (): RegisterIndividualPasswordData => ({
    password,
    confirmPassword,
    acceptedTerms,
  });

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!isPasswordStrongEnough(password)) {
      errors.password = 'Please create a stronger password';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      errors.acceptedTerms = 'You must agree to the Terms and Privacy Policy';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    onSubmit(buildFormData());
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(buildFormData());
    toast.success('Draft saved');
  };

  return (
    <form onSubmit={handleSubmit} className="partner-register-form">
      <div className="partner-account-badge-row">
        <span className="partner-account-badge form-highlight-surface">
          <Star size={14} />
          Individual account
        </span>
      </div>

      <h2 className="partner-form-section-title">Secure your account</h2>

      <div className="partner-form-group">
        <label htmlFor="individualPassword" className="partner-field-label">
          Password
          <FieldErrorHint message={fieldErrors.password} />
        </label>
        <div className="partner-input-with-icon">
          <Lock size={18} className="partner-input-icon" />
          <input
            id="individualPassword"
            type={showPassword ? 'text' : 'password'}
            className={fieldErrors.password ? 'partner-input--error' : ''}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              clearFieldError('password');
            }}
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            className="partner-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <PasswordStrengthIndicator password={password} />
      </div>

      <div className="partner-form-group">
        <label
          htmlFor="individualConfirmPassword"
          className="partner-field-label"
        >
          Confirm password
          <FieldErrorHint message={fieldErrors.confirmPassword} />
        </label>
        <div className="partner-input-with-icon">
          <Lock size={18} className="partner-input-icon" />
          <input
            id="individualConfirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            className={fieldErrors.confirmPassword ? 'partner-input--error' : ''}
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              clearFieldError('confirmPassword');
            }}
            placeholder="Re-enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            className="partner-password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <InfoBanner icon={Shield} compact>
        Your credentials are encrypted and stored securely.
      </InfoBanner>

      <div className="partner-terms-row">
        <label className="partner-terms">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={e => {
              setAcceptedTerms(e.target.checked);
              clearFieldError('acceptedTerms');
            }}
            disabled={isLoading}
          />
          <span>
            I agree to the <a href="#">Terms</a> and{' '}
            <a href="#">Privacy Policy</a>
          </span>
        </label>
        <FieldErrorHint message={fieldErrors.acceptedTerms} />
      </div>

      <div className="partner-wizard-footer partner-wizard-footer--with-draft">
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
        <div className="partner-wizard-footer-actions">
          {onSaveDraft && (
            <button
              type="button"
              className="partner-save-draft-btn"
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              Save draft
            </button>
          )}
          <Button type="submit" className="partner-continue-btn" isLoading={isLoading}>
            Continue
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </form>
  );
}

export default RegisterIndividualPasswordStep;
