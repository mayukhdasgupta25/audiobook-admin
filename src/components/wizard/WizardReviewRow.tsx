import type { LucideIcon } from 'lucide-react';
import { Pencil } from 'lucide-react';

interface WizardReviewRowProps {
  label: string;
  value: string;
  icon: LucideIcon;
  onEdit?: () => void;
}

function WizardReviewRow({
  label,
  value,
  icon: Icon,
  onEdit,
}: WizardReviewRowProps) {
  return (
    <div className="wizard-review-row">
      <div className="wizard-review-row-icon-wrap" aria-hidden="true">
        <Icon size={18} className="wizard-review-row-icon" strokeWidth={1.75} />
      </div>
      <div className="wizard-review-row-body">
        <span className="wizard-review-row-label">{label}</span>
        <span className="wizard-review-row-value">{value}</span>
      </div>
      {onEdit && (
        <button
          type="button"
          className="wizard-review-row-edit"
          onClick={onEdit}
          aria-label={`Edit ${label.toLowerCase()}`}
        >
          <Pencil size={14} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default WizardReviewRow;
