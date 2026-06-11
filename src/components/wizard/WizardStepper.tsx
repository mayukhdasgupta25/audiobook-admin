import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import '../../styles/components/wizard/WizardShell.css';

export interface WizardStepConfig {
  label: string;
  description?: string;
  icon?: LucideIcon;
}

interface WizardStepperProps {
  steps: WizardStepConfig[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

function WizardStepper({
  steps,
  currentStep,
  orientation = 'horizontal',
}: WizardStepperProps) {
  return (
    <div
      className={`wizard-stepper${
        orientation === 'vertical' ? ' wizard-stepper--vertical' : ''
      }`}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-label={`Progress, step ${currentStep} of ${steps.length}`}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const Icon = step.icon;

        return (
          <div
            key={step.label}
            className={`wizard-step${
              isActive ? ' wizard-step--active' : ''
            }${isComplete ? ' wizard-step--complete' : ''}`}
          >
            <div className="wizard-step-circle">
              {isComplete ? (
                <Check size={14} />
              ) : Icon ? (
                <Icon size={16} />
              ) : (
                stepNumber
              )}
            </div>
            <span className="wizard-step-label">{step.label}</span>
            {step.description && (
              <span className="wizard-step-description">{step.description}</span>
            )}
            {index < steps.length - 1 && (
              <span className="wizard-step-line" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default WizardStepper;
