import { createContext, useContext } from 'react';

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
