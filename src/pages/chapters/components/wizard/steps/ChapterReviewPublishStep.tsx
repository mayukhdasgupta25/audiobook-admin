import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDurationDetailed } from '../../../../../utils/formatting';
import type { ChapterWizardData } from '../../../../../types/audiobook';
import '../../../../../styles/pages/chapters/components/forms/ChapterForm.css';

interface ChapterReviewPublishStepProps {
  data: ChapterWizardData;
  errors: Partial<Record<keyof ChapterWizardData | 'scheduledAt', string>>;
  scheduleMode: boolean;
  onScheduleModeChange: (enabled: boolean) => void;
  onChange: (updates: Partial<ChapterWizardData>) => void;
}

function ChapterReviewPublishStep({
  data,
  errors,
  scheduleMode,
  onScheduleModeChange,
  onChange,
}: ChapterReviewPublishStepProps) {
  return (
    <div className="wizard-step-form">
      <div className="wizard-review-grid">
        <div className="wizard-review-item">
          <span className="wizard-review-label">Chapter</span>
          <span className="wizard-review-value">{data.chapterNumber}</span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Title</span>
          <span className="wizard-review-value">{data.title || '—'}</span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Description</span>
          <span className="wizard-review-value">
            {data.description || '—'}
          </span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Audio</span>
          <span className="wizard-review-value">
            {data.file?.name || (data.existingAudioUrl ? 'Existing file' : '—')}
          </span>
        </div>
        {data.duration !== undefined && (
          <div className="wizard-review-item">
            <span className="wizard-review-label">Duration</span>
            <span className="wizard-review-value">
              {formatDurationDetailed(data.duration)}
            </span>
          </div>
        )}
        <div className="wizard-review-item">
          <span className="wizard-review-label">Cover</span>
          <span className="wizard-review-value">
            {data.coverImage?.name ||
              (data.existingCoverUrl ? 'Existing cover' : '—')}
          </span>
        </div>
      </div>

      <div className="wizard-field-group">
        <label className="genre-checkbox">
          <input
            type="checkbox"
            checked={scheduleMode}
            onChange={e => onScheduleModeChange(e.target.checked)}
          />
          <span>Schedule this chapter for later</span>
        </label>
      </div>

      {scheduleMode && (
        <div className="wizard-field-group">
          <label htmlFor="chapter-schedule-at">Schedule at</label>
          <DatePicker
            id="chapter-schedule-at"
            selected={
              data.scheduledAt ? new Date(data.scheduledAt) : null
            }
            onChange={(date: Date | null) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                onChange({
                  scheduledAt: `${year}-${month}-${day}T${hours}:${minutes}`,
                });
              } else {
                onChange({ scheduledAt: undefined });
              }
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select date and time"
            className={`date-picker-input${errors.scheduledAt ? ' input-error' : ''}`}
            minDate={new Date()}
            isClearable
          />
          {errors.scheduledAt && (
            <span className="wizard-field-error">{errors.scheduledAt}</span>
          )}
        </div>
      )}

    </div>
  );
}

export default ChapterReviewPublishStep;
