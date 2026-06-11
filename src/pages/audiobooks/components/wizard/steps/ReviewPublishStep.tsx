import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { AudiobookWizardData } from '../../../../../types/audiobook';
import type { GenreItem, TagItem } from '../../../../../utils/audiobookApi';
import { filterAudiobookMeta } from '../../../../../utils/audiobookWizard';
import '../../../../../styles/pages/audiobooks/components/forms/AudiobookForm.css';

interface ReviewPublishStepProps {
  data: AudiobookWizardData;
  errors: Partial<Record<keyof AudiobookWizardData | 'scheduledAt', string>>;
  genres: GenreItem[];
  tags: TagItem[];
  scheduleMode: boolean;
  onScheduleModeChange: (enabled: boolean) => void;
  onChange: (updates: Partial<AudiobookWizardData>) => void;
}

function ReviewPublishStep({
  data,
  errors,
  genres,
  tags,
  scheduleMode,
  onScheduleModeChange,
  onChange,
}: ReviewPublishStepProps) {
  const genreNames = data.genres
    .map(id => genres.find(g => g.id === id)?.name)
    .filter(Boolean);
  const tagNames = data.tags
    .map(id => tags.find(t => t.id === id)?.name)
    .filter(Boolean);
  const metaEntries = Object.entries(filterAudiobookMeta(data.meta));

  return (
    <div className="wizard-step-form">
      <div className="wizard-review-grid">
        <div className="wizard-review-item">
          <span className="wizard-review-label">Title</span>
          <span className="wizard-review-value">{data.title || '—'}</span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Author</span>
          <span className="wizard-review-value">{data.author || '—'}</span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Narrators</span>
          <span className="wizard-review-value">
            {data.narrators.length > 0 ? data.narrators.join(', ') : '—'}
          </span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Language</span>
          <span className="wizard-review-value">{data.language}</span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Genres</span>
          <span className="wizard-review-value">
            {genreNames.length > 0 ? genreNames.join(', ') : '—'}
          </span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Tags</span>
          <span className="wizard-review-value">
            {tagNames.length > 0 ? tagNames.join(', ') : '—'}
          </span>
        </div>
        <div className="wizard-review-item">
          <span className="wizard-review-label">Description</span>
          <span className="wizard-review-value">
            {data.description || '—'}
          </span>
        </div>
        {metaEntries.length > 0 && (
          <div className="wizard-review-item">
            <span className="wizard-review-label">Additional info</span>
            <span className="wizard-review-value">
              {metaEntries.map(([key, value]) => `${key}: ${value}`).join('; ')}
            </span>
          </div>
        )}
      </div>

      <div className="wizard-field-group">
        <label className="genre-checkbox">
          <input
            type="checkbox"
            checked={scheduleMode}
            onChange={e => onScheduleModeChange(e.target.checked)}
          />
          <span>Schedule this audiobook for later</span>
        </label>
      </div>

      {scheduleMode && (
        <div className="wizard-field-group">
          <label htmlFor="audiobook-schedule-at">Schedule at</label>
          <DatePicker
            id="audiobook-schedule-at"
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

export default ReviewPublishStep;
