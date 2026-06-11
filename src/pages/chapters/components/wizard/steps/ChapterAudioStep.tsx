import { formatDurationDetailed } from '../../../../../utils/formatting';
import type { ChapterWizardData } from '../../../../../types/audiobook';
import '../../../../../styles/pages/chapters/components/forms/ChapterForm.css';

interface ChapterAudioStepProps {
  data: ChapterWizardData;
  errors: Partial<Record<keyof ChapterWizardData, string>>;
  mode: 'create' | 'edit';
  isLoading?: boolean;
  isLoadingMetadata?: boolean;
  onFileChange: (file: File | null) => void;
  onChange: (updates: Partial<ChapterWizardData>) => void;
}

function ChapterAudioStep({
  data,
  errors,
  mode,
  isLoading = false,
  isLoadingMetadata = false,
  onFileChange,
  onChange,
}: ChapterAudioStepProps) {
  return (
    <div className="wizard-step-form">
      <div className="wizard-field-group">
        <label htmlFor="chapter-file">
          Audio File {mode === 'create' && <span className="wizard-required">*</span>}
          {mode === 'edit' && (
            <span className="optional-text">
              {' '}
              (optional - leave empty to keep current file)
            </span>
          )}
        </label>
        {mode === 'edit' && data.existingAudioUrl && !data.file && (
          <p className="narrators-hint">Current audio file is attached.</p>
        )}
        <input
          id="chapter-file"
          type="file"
          accept="audio/*"
          onChange={e => onFileChange(e.target.files?.[0] || null)}
          disabled={isLoading || isLoadingMetadata}
          className={errors.file ? 'input-error' : ''}
        />
        {isLoadingMetadata && (
          <span className="loading-message">Loading audio metadata...</span>
        )}
        {data.file && (
          <div className="file-preview">
            <span className="file-name">{data.file.name}</span>
          </div>
        )}
        {errors.file && <span className="wizard-field-error">{errors.file}</span>}
      </div>

      {data.file && data.duration !== undefined && (
        <>
          <div className="wizard-field-group">
            <label>Duration</label>
            <input
              type="text"
              value={formatDurationDetailed(data.duration)}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="wizard-field-group">
            <label htmlFor="chapter-start-position">Start Position (seconds)</label>
            <input
              id="chapter-start-position"
              type="number"
              value={data.startPosition ?? 0}
              onChange={e => {
                const value = parseInt(e.target.value, 10) || 0;
                onChange({ startPosition: value });
              }}
              min={0}
              max={data.duration}
              disabled={isLoading}
            />
          </div>

          <div className="wizard-field-group">
            <label htmlFor="chapter-end-position">End Position (seconds)</label>
            <input
              id="chapter-end-position"
              type="number"
              value={data.endPosition ?? data.duration ?? 0}
              onChange={e => {
                const value = parseInt(e.target.value, 10) || 0;
                onChange({ endPosition: value });
              }}
              min={data.startPosition ?? 0}
              max={data.duration}
              disabled={isLoading}
            />
          </div>
        </>
      )}

    </div>
  );
}

export default ChapterAudioStep;
