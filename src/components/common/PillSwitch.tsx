import '../../styles/components/common/PillSwitch.css';

interface PillSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  id?: string;
}

function PillSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}: PillSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`pill-switch${checked ? ' pill-switch--checked' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="pill-switch-thumb" aria-hidden="true" />
      <span className="pill-switch-text">{label}</span>
    </button>
  );
}

export default PillSwitch;
