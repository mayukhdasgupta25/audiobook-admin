import { Eye } from 'lucide-react';

interface WizardLivePreviewHeaderProps {
  subtitle: string;
}

function WizardLivePreviewHeader({ subtitle }: WizardLivePreviewHeaderProps) {
  return (
    <div className="wizard-preview-header">
      <span className="wizard-field-label-icon-wrap" aria-hidden="true">
        <Eye size={14} className="wizard-field-label-icon" />
      </span>
      <div>
        <h3 className="wizard-preview-title">Live Preview</h3>
        <p className="wizard-preview-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export default WizardLivePreviewHeader;
