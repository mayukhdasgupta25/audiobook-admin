import type { ReactNode } from 'react';
import Button from '../common/Button';
import WizardStepIndicator from './WizardStepIndicator';
import WizardStepper, { type WizardStepConfig } from './WizardStepper';
import {
  WizardFormActionsContext,
  type WizardFormActionsValue,
  type WizardMode,
} from './wizardFormActionsContext';
import { WizardStepActionsBar } from './wizardFormActions';
import '../../styles/components/wizard/WizardShell.css';

export type { WizardMode };

interface WizardShellProps {
  className?: string;
  title: string;
  subtitle: string;
  mode: WizardMode;
  currentStep: number;
  totalSteps: number;
  steps: WizardStepConfig[];
  draftSaved?: boolean;
  isLoading?: boolean;
  preview: ReactNode;
  children: ReactNode;
  onCancel: () => void;
  onSaveDraft?: () => void;
  onBack?: () => void;
  onContinue?: () => void;
  onPublish?: () => void;
  onSchedule?: () => void;
  scheduledAt?: string;
  scheduleError?: string;
  onScheduledAtChange?: (scheduledAt: string | undefined) => void;
  showBack?: boolean;
  showContinue?: boolean;
  showPublishActions?: boolean;
}

function WizardShell({
  className,
  title,
  subtitle,
  mode,
  currentStep,
  totalSteps,
  steps,
  draftSaved = false,
  isLoading = false,
  preview,
  children,
  onCancel,
  onSaveDraft,
  onBack,
  onContinue,
  onPublish,
  onSchedule,
  scheduledAt,
  scheduleError,
  onScheduledAtChange,
  showBack = false,
  showContinue = false,
  showPublishActions = false,
}: WizardShellProps) {
  const formActions: WizardFormActionsValue = {
    mode,
    isLoading,
    showBack,
    showContinue,
    showPublishActions,
    onBack,
    onContinue,
    onPublish,
    onSchedule,
    scheduledAt,
    scheduleError,
    onScheduledAtChange,
  };

  return (
    <WizardFormActionsContext.Provider value={formActions}>
      <div className={className ? `wizard-page ${className}` : 'wizard-page'}>
        <div className="wizard-header">
          <div className="wizard-header-layout">
            <div className="wizard-header-title-row">
              <h1 className="wizard-title">{title}</h1>
              <div className="wizard-header-step-counter">
                <WizardStepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                />
              </div>
            </div>
            <p className="wizard-subtitle">{subtitle}</p>
          </div>
          <div className="wizard-header-meta">
            {draftSaved && (
              <span className="wizard-draft-badge">Draft saved</span>
            )}
          </div>
        </div>

        <div className="wizard-body">
          <div className="wizard-content-column">
            <div className="wizard-form-column">
              <WizardStepper steps={steps} currentStep={currentStep} />
              {children}
            </div>
            <div className="wizard-footer">
              <div className="wizard-footer-left">
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  className="wizard-btn-cancel"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                {onSaveDraft && (
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={onSaveDraft}
                    disabled={isLoading}
                  >
                    Save draft
                  </Button>
                )}
              </div>
              <WizardStepActionsBar />
            </div>          </div>
          <aside className="wizard-preview-column">{preview}</aside>
        </div>
      </div>
    </WizardFormActionsContext.Provider>
  );
}

export default WizardShell;
