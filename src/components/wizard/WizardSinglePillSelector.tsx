import { Check } from 'lucide-react';

export interface WizardSinglePillOption {
  id: string;
  label: string;
}

interface WizardSinglePillSelectorProps {
  options: WizardSinglePillOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;
  name: string;
  hasError?: boolean;
}

function toInputId(groupName: string, id: string): string {
  return `${groupName.replace(/\s+/g, '-').toLowerCase()}-${id}`;
}

function WizardSinglePillSelector({
  options,
  value,
  onChange,
  disabled = false,
  name,
  hasError = false,
}: WizardSinglePillSelectorProps) {
  return (
    <div
      className={`wizard-pill-selector${hasError ? ' wizard-pill-selector--error' : ''}`}
      role="radiogroup"
      aria-label={name}
    >
      {options.map(option => {
        const isSelected = value === option.id;
        const inputId = toInputId(name, option.id);

        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={`wizard-pill-option${
              isSelected ? ' wizard-pill-option--selected' : ''
            }`}
            onClick={e => {
              if (disabled || !isSelected) {
                return;
              }
              e.preventDefault();
              onChange(null);
            }}
          >
            <input
              id={inputId}
              type="radio"
              name={name}
              checked={isSelected}
              onChange={() => onChange(option.id)}
              disabled={disabled}
              className="wizard-pill-input"
            />
            {isSelected && (
              <span className="wizard-pill-check-badge" aria-hidden="true">
                <Check size={11} strokeWidth={3} />
              </span>
            )}
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

export default WizardSinglePillSelector;
