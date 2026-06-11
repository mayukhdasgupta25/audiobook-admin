import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import DatePicker from 'react-datepicker';
import { ChevronDown, X } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { useWizardFormActions } from './wizardFormActions';

function formatScheduledAt(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface ScheduleCalendarContainerProps {
  className?: string;
  children: ReactNode;
  onApply: () => void;
  onCancel: () => void;
}

function ScheduleCalendarContainer({
  className,
  children,
  onApply,
  onCancel,
}: ScheduleCalendarContainerProps) {
  return (
    <div className={`wizard-schedule-calendar-container ${className ?? ''}`}>
      {children}
      <div className="wizard-schedule-calendar-actions">
        <button
          type="button"
          className="wizard-schedule-calendar-cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="wizard-schedule-calendar-apply"
          onClick={onApply}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function WizardScheduleButton() {
  const {
    isLoading,
    onSchedule,
    scheduledAt,
    onScheduledAtChange,
    scheduleError,
  } = useWizardFormActions();

  const pickerId = useId();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);

  const hasSchedule = Boolean(scheduledAt);
  const selectedDate = scheduledAt ? new Date(scheduledAt) : null;

  useEffect(() => {
    if (isPickerOpen) {
      setPendingDate(selectedDate ?? new Date());
    }
  }, [isPickerOpen, selectedDate]);

  if (!onSchedule || !onScheduledAtChange) {
    return null;
  }

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onScheduledAtChange(undefined);
    setIsPickerOpen(false);
  };

  const openPicker = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isLoading) {
      setIsPickerOpen(true);
    }
  };

  const applySchedule = () => {
    if (!pendingDate) {
      return;
    }
    onScheduledAtChange(formatScheduledAt(pendingDate));
    setIsPickerOpen(false);
  };

  return (
    <div className="wizard-schedule-control">
      <div
        className={`wizard-schedule-btn-combined${
          hasSchedule ? ' wizard-schedule-btn-combined--active' : ''
        }`}
      >
        <button
          type="button"
          className="wizard-schedule-btn-main"
          onClick={onSchedule}
          disabled={isLoading || !hasSchedule}
        >
          Schedule
        </button>
        {hasSchedule ? (
          <button
            type="button"
            className="wizard-schedule-btn-icon"
            onClick={handleClear}
            disabled={isLoading}
            aria-label="Clear schedule date and time"
          >
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="wizard-schedule-btn-icon"
            onClick={openPicker}
            disabled={isLoading}
            aria-label="Choose schedule date and time"
            aria-expanded={isPickerOpen}
            aria-controls={pickerId}
          >
            <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
      </div>

      <DatePicker
        id={pickerId}
        selected={pendingDate}
        onChange={date => {
          if (date) {
            setPendingDate(date);
          }
        }}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={new Date()}
        shouldCloseOnSelect={false}
        open={isPickerOpen}
        onClickOutside={() => setIsPickerOpen(false)}
        popperPlacement="top-end"
        popperClassName="wizard-schedule-popper"
        calendarClassName="wizard-schedule-calendar"
        calendarContainer={({ className, children }) => (
          <ScheduleCalendarContainer
            className={className}
            onApply={applySchedule}
            onCancel={() => setIsPickerOpen(false)}
          >
            {children}
          </ScheduleCalendarContainer>
        )}
        customInput={
          <button
            ref={anchorRef}
            type="button"
            className="wizard-schedule-picker-anchor"
            tabIndex={-1}
            aria-hidden="true"
          />
        }
      />

      {scheduleError && (
        <span className="wizard-field-error wizard-schedule-error">
          {scheduleError}
        </span>
      )}
    </div>
  );
}

export default WizardScheduleButton;
