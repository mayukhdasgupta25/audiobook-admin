import { Check } from 'lucide-react';

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface PillSelectorProps<T extends string> {
  options: PillOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  name: string;
  variant?: 'default' | 'solid';
}

function toInputId(groupName: string, value: string): string {
  return `${groupName.replace(/\s+/g, '-').toLowerCase()}-${value}`;
}

function PillSelector<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  name,
  variant = 'default',
}: PillSelectorProps<T>) {
  return (
    <div
      className={`pill-selector${variant === 'solid' ? ' pill-selector--solid' : ''}`}
      role="radiogroup"
      aria-label={name}
    >
      {options.map(option => {
        const isSelected = value === option.value;
        const inputId = toInputId(name, option.value);

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={`pill-selector-option${
              isSelected ? ' pill-selector-option--selected' : ''
            }`}
          >
            <input
              id={inputId}
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              className="pill-selector-input"
            />
            {isSelected && <Check size={14} aria-hidden="true" />}
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

export default PillSelector;
