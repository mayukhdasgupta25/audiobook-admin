import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import '../../styles/components/wizard/WizardFieldLabel.css';
interface WizardFieldLabelProps {
  htmlFor?: string;
  icon: LucideIcon;
  children: ReactNode;
  required?: boolean;
}

function WizardFieldLabel({
  htmlFor,
  icon: Icon,
  children,
  required = false,
}: WizardFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="wizard-field-label">
      <span className="wizard-field-label-icon-wrap" aria-hidden="true">
        <Icon size={14} className="wizard-field-label-icon" />
      </span>
      <span>
        {children}
        {required && <span className="wizard-required"> *</span>}
      </span>
    </label>
  );
}

export default WizardFieldLabel;
