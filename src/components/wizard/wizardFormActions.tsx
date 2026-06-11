import { ArrowLeft, ArrowRight } from 'lucide-react';
import { createContext, useContext } from 'react';
import Button from '../common/Button';
import WizardScheduleButton from './WizardScheduleButton';

export type WizardMode = 'create' | 'edit';

export interface WizardFormActionsValue {
  mode: WizardMode;
  isLoading: boolean;
  showBack: boolean;
  showContinue: boolean;
  showPublishActions: boolean;
  scheduledAt?: string;
  scheduleError?: string;
  onBack?: () => void;
  onContinue?: () => void;
  onPublish?: () => void;
  onSchedule?: () => void;
  onScheduledAtChange?: (scheduledAt: string | undefined) => void;
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
    scheduledAt,
    onBack,
    onPublish,
    onSchedule,
    onScheduledAtChange,
  } = useWizardFormActions();

  const hasScheduledPublish = Boolean(scheduledAt);

  if (!showBack && !showContinue && !showPublishActions) {
    return null;
  }

  return (
    <div className="wizard-step-actions">
      {showBack && onBack && (
        <button
          type="button"
          className="wizard-back-btn"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </button>
      )}
      {showContinue && <WizardContinueButton />}
      {showPublishActions && (
        <>
          {onSchedule && onScheduledAtChange && <WizardScheduleButton />}
          {onPublish && (
            <Button
              type="button"
              className="wizard-btn-solid wizard-publish-btn"
              onClick={onPublish}
              isLoading={isLoading && !hasScheduledPublish}
              disabled={isLoading || hasScheduledPublish}
            >
              {mode === 'edit' ? 'Update' : 'Publish'}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
