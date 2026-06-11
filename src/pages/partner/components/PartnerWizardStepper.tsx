import { Check } from 'lucide-react';
import type { PartnerType } from '../../../types/partner';

const ORGANIZATION_STEPS = [
  'Who you are?',
  'Account details',
  'Verification',
  'Organization',
] as const;

const INDIVIDUAL_STEPS = ['Profile', 'Security', 'Verification'] as const;

interface PartnerWizardStepperProps {
  step: 1 | 2 | 3 | 4;
  partnerType: PartnerType | null;
}

function PartnerWizardStepper({ step, partnerType }: PartnerWizardStepperProps) {
  if (step === 1) {
    return null;
  }

  if (partnerType === 'individual') {
    const displayStep = (step - 1) as 1 | 2 | 3;

    return (
      <div
        className="partner-wizard-stepper"
        role="progressbar"
        aria-valuenow={displayStep}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Registration progress, step ${displayStep} of 3`}
      >
        {INDIVIDUAL_STEPS.map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isComplete = stepNumber < displayStep;
          const isActive = stepNumber === displayStep;

          return (
            <div
              key={label}
              className={`partner-wizard-step${
                isActive ? ' partner-wizard-step--active' : ''
              }${isComplete ? ' partner-wizard-step--complete' : ''}`}
            >
              <div className="partner-wizard-step-circle">
                {isComplete ? <Check size={14} /> : stepNumber}
              </div>
              <span className="partner-wizard-step-label">{label}</span>
              {index < INDIVIDUAL_STEPS.length - 1 && (
                <span className="partner-wizard-step-line" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="partner-wizard-stepper"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={4}
      aria-label={`Registration progress, step ${step} of 4`}
    >
      {ORGANIZATION_STEPS.map((label, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3 | 4;
        const isComplete = stepNumber < step;
        const isActive = stepNumber === step;

        return (
          <div
            key={label}
            className={`partner-wizard-step${
              isActive ? ' partner-wizard-step--active' : ''
            }${isComplete ? ' partner-wizard-step--complete' : ''}`}
          >
            <div className="partner-wizard-step-circle">
              {isComplete ? <Check size={14} /> : stepNumber}
            </div>
            <span className="partner-wizard-step-label">{label}</span>
            {index < ORGANIZATION_STEPS.length - 1 && (
              <span className="partner-wizard-step-line" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PartnerWizardStepper;
