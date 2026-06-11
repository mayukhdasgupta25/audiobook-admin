import { Building2, CheckCircle2, Mail, Shield, User } from 'lucide-react';
import type { PartnerType } from '../../types/partner';

interface RegistrationSummaryProps {
  partnerType: PartnerType;
  email: string;
  organizationName?: string;
  logoPreviewUrl?: string | null;
  fullName?: string;
  photoPreviewUrl?: string | null;
}

function RegistrationSummary({
  partnerType,
  email,
  organizationName,
  logoPreviewUrl,
  fullName,
  photoPreviewUrl,
}: RegistrationSummaryProps) {
  const isIndividual = partnerType === 'individual';
  const workspaceNote = isIndividual
    ? 'Once verified, your personal workspace will be created instantly.'
    : 'Once verified, your partner workspace will be created instantly.';

  return (
    <div className="registration-summary form-highlight-surface">
      <div className="registration-summary-grid">
        <div className="registration-summary-item">
          {isIndividual ? <User size={16} /> : <Building2 size={16} />}
          <div>
            <p className="registration-summary-label">Account type</p>
            <p className="registration-summary-value">
              {isIndividual ? 'Individual' : 'Organization'}
            </p>
          </div>
        </div>
        <div className="registration-summary-item">
          <Mail size={16} />
          <div>
            <p className="registration-summary-label">Work email</p>
            <p className="registration-summary-value">{email}</p>
          </div>
        </div>
        {partnerType === 'organization' && organizationName && (
          <div className="registration-summary-item">
            {logoPreviewUrl ? (
              <img
                src={logoPreviewUrl}
                alt=""
                className="registration-summary-logo"
              />
            ) : (
              <Building2 size={16} />
            )}
            <div>
              <p className="registration-summary-label">Organization</p>
              <p className="registration-summary-value">{organizationName}</p>
            </div>
          </div>
        )}
        {isIndividual && fullName && (
          <div className="registration-summary-item">
            {photoPreviewUrl ? (
              <img
                src={photoPreviewUrl}
                alt=""
                className="registration-summary-avatar"
              />
            ) : (
              <User size={16} />
            )}
            <div>
              <p className="registration-summary-label">Name</p>
              <p className="registration-summary-value">{fullName}</p>
            </div>
          </div>
        )}
      </div>
      <div className="registration-summary-aside">
        <p className="registration-summary-note">
          <CheckCircle2
            size={14}
            className="registration-summary-note-icon--success"
          />
          {workspaceNote}
        </p>
        <p className="registration-summary-note">
          <Shield size={14} />
          Your information is secure and encrypted.
        </p>
      </div>
    </div>
  );
}

export default RegistrationSummary;
