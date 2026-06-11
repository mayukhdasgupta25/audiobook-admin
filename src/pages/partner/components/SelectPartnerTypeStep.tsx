import { useState } from 'react';
import { ArrowRight, Building2, Check, PenLine, Star } from 'lucide-react';
import type { PartnerType } from '../../../types/partner';
import Button from '../../../components/common/Button';
import InfoBanner from '../../../components/common/InfoBanner';

interface SelectPartnerTypeStepProps {
  isLoading: boolean;
  initialType?: PartnerType | null;
  onContinue: (type: PartnerType) => void;
  onBack?: () => void;
}

function SelectPartnerTypeStep({
  isLoading,
  initialType = null,
  onContinue,
  onBack,
}: SelectPartnerTypeStepProps) {
  const [selectedType, setSelectedType] = useState<PartnerType | null>(
    initialType
  );

  return (
    <div className="partner-type-step">
      <p className="partner-step-intro">
        Choose the type of partner account you want to create.
      </p>

      <div className="partner-type-grid">
        <button
          type="button"
          className={`partner-type-card${
            selectedType === 'organization' ? ' partner-type-card--selected' : ''
          }`}
          onClick={() => setSelectedType('organization')}
          disabled={isLoading}
        >
          {selectedType === 'organization' && (
            <span className="partner-type-check" aria-hidden="true">
              <Check size={16} />
            </span>
          )}
          <span className="partner-type-illustration partner-type-illustration--org">
            <Building2 size={32} />
          </span>
          <span className="partner-type-label">Organization</span>
          <span className="partner-type-description">
            Register a company, publisher, or team with admin access.
          </span>
          <span className="partner-type-badge form-highlight-surface">
            <Star size={12} />
            Recommended for teams
          </span>
        </button>

        <button
          type="button"
          className={`partner-type-card${
            selectedType === 'individual' ? ' partner-type-card--selected' : ''
          }`}
          onClick={() => setSelectedType('individual')}
          disabled={isLoading}
        >
          {selectedType === 'individual' && (
            <span className="partner-type-check" aria-hidden="true">
              <Check size={16} />
            </span>
          )}
          <span className="partner-type-illustration partner-type-illustration--individual">
            <PenLine size={32} />
          </span>
          <span className="partner-type-label">Individual</span>
          <span className="partner-type-description">
            Register as an independent author or creator.
          </span>
        </button>
      </div>

      <InfoBanner>You can invite teammates later from your dashboard.</InfoBanner>

      <div className="partner-wizard-footer">
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
        <Button
          type="button"
          className="partner-continue-btn"
          disabled={!selectedType || isLoading}
          onClick={() => selectedType && onContinue(selectedType)}
        >
          Continue
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default SelectPartnerTypeStep;
