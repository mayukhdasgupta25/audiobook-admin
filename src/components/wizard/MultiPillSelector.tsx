import { Check } from 'lucide-react';

export interface MultiPillOption {
  id: string;
  label: string;
}

interface MultiPillSelectorProps {
  options: MultiPillOption[];
  selected: string[];
  onToggle: (id: string) => void;
  disabled?: boolean;
  name: string;
  hasError?: boolean;
}

function toInputId(groupName: string, id: string): string {
  return `${groupName.replace(/\s+/g, '-').toLowerCase()}-${id}`;
}

function MultiPillSelector({
  options,
  selected,
  onToggle,
  disabled = false,
  name,
  hasError = false,
}: MultiPillSelectorProps) {
  return (
    <div
      className={`wizard-pill-selector${hasError ? ' wizard-pill-selector--error' : ''}`}
      role="group"
      aria-label={name}
    >
      {options.map(option => {
        const isSelected = selected.includes(option.id);
        const inputId = toInputId(name, option.id);

        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={`wizard-pill-option${
              isSelected ? ' wizard-pill-option--selected' : ''
            }`}
          >
            <input
              id={inputId}
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(option.id)}
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

export default MultiPillSelector;
