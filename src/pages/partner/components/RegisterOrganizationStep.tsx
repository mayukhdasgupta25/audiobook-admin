import { FormEvent, useState } from 'react';
import InfoHint from '../../../components/common/InfoHint';
import Button from '../../../components/common/Button';
export interface RegisterOrganizationFormData {
  organizationName: string;
}
interface RegisterOrganizationStepProps {
  isLoading: boolean;
  onSubmit: (data: RegisterOrganizationFormData) => void;
  onBack?: () => void;
}

function RegisterOrganizationStep({
  isLoading,
  onSubmit,
  onBack,
}: RegisterOrganizationStepProps) {
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!organizationName.trim()) {
      setError('Organization name is required');
      return;
    }
    onSubmit({
      organizationName: organizationName.trim(),
    });
  };
  return (
    <form onSubmit={handleSubmit} className="partner-register-form">
      <p className="partner-form-section-title">Register your organization</p>
      <div className="partner-form-group">
        <label htmlFor="organizationName">
          Organization name
          <InfoHint message="Organization name cannot be changed later" />
        </label>
        <input
          id="organizationName"
          type="text"
          value={organizationName}
          onChange={e => {
            setOrganizationName(e.target.value);
            setError('');
          }}
          placeholder="Enter organization name"
          disabled={isLoading}
          className={error && !organizationName.trim() ? 'input-error' : ''}
        />
      </div>
      <div className="partner-form-group">
        <label htmlFor="orgRole">Role</label>
        <input
          id="orgRole"
          type="text"
          value="ADMIN"
          readOnly
          disabled={isLoading}
        />
      </div>
      {error && <span className="partner-error-message">{error}</span>}
      <div className="partner-form-actions">
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Create organization
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

export default RegisterOrganizationStep;
