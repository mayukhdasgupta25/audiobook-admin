import { ArrowRight } from 'lucide-react';
import { createContext, useContext } from 'react';
import Button from '../common/Button';

export type WizardMode = 'create' | 'edit';

export interface WizardFormActionsValue {
  mode: WizardMode;
  isLoading: boolean;
  showBack: boolean;
  showContinue: boolean;
  showPublishActions: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  onPublish?: () => void;
  onSchedule?: () => void;
}

export const WizardFormActionsContext =
  createContext<WizardFormActionsValue | null>(null);

export function useWizardFormActions(): WizardFormActionsValue {
  const context = useContext(WizardFormActionsContext);
  if (!context) {
    throw new Error('useWizardFormActions must be used within WizardShell');
  }
  return context;
}

export function WizardContinueButton({ className = '' }: { className?: string }) {
  const { showContinue, onContinue, isLoading } = useWizardFormActions();

  if (!showContinue || !onContinue) {
    return null;
  }

  return (
    <Button
      type="button"
      className={`wizard-continue-btn wizard-btn-solid ${className}`.trim()}
      onClick={onContinue}
      isLoading={isLoading}
    >
      Continue
      <ArrowRight size={16} aria-hidden="true" />
    </Button>
  );
}

export function WizardStepActionsBar() {
  const {
    mode,
    isLoading,
    showBack,
    showContinue,
    showPublishActions,
    onBack,
    onPublish,
    onSchedule,
  } = useWizardFormActions();

  if (!showBack && !showContinue && !showPublishActions) {
    return null;
  }

  return (
    <div className="wizard-step-actions">
      {showBack && onBack && (
        <button
          type="button"
          className="wizard-back-link"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </button>
      )}
      {showContinue && <WizardContinueButton />}
      {showPublishActions && (
        <>
          {onSchedule && (
            <Button
              type="button"
              variant="warning"
              onClick={onSchedule}
              isLoading={isLoading}
            >
              Schedule
            </Button>
          )}
          {onPublish && (
            <Button
              type="button"
              className="wizard-btn-solid"
              onClick={onPublish}
              isLoading={isLoading}
            >
              {mode === 'edit' ? 'Update' : 'Publish'}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
