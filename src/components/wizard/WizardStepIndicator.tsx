interface WizardStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  'aria-hidden'?: boolean;
}

function WizardStepIndicator({
  currentStep,
  totalSteps,
  className = '',
  'aria-hidden': ariaHidden,
}: WizardStepIndicatorProps) {
  return (
    <span
      className={`wizard-step-indicator ${className}`.trim()}
      aria-hidden={ariaHidden}
    >
      Step{' '}
      <span className="wizard-step-highlight">{currentStep}</span> of{' '}
      {totalSteps}
    </span>
  );
}

export default WizardStepIndicator;
