import type { ChapterWizardData } from '../../../../../types/audiobook';

interface ChapterBasicsStepProps {
  data: ChapterWizardData;
  errors: Partial<Record<keyof ChapterWizardData, string>>;
  isLoading?: boolean;
  onChange: (updates: Partial<ChapterWizardData>) => void;
}

function ChapterBasicsStep({
  data,
  errors,
  isLoading = false,
  onChange,
}: ChapterBasicsStepProps) {
  return (
    <div className="wizard-step-form">
      <div className="wizard-field-group">
        <label htmlFor="chapter-title">
          Title <span className="wizard-required">*</span>
        </label>
        <input
          id="chapter-title"
          type="text"
          value={data.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="Enter chapter title"
          disabled={isLoading}
        />
        {errors.title && (
          <span className="wizard-field-error">{errors.title}</span>
        )}
      </div>

      <div className="wizard-field-group">
        <label htmlFor="chapter-description">
          Description <span className="wizard-required">*</span>
        </label>
        <textarea
          id="chapter-description"
          value={data.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Enter chapter description"
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <span className="wizard-field-error">{errors.description}</span>
        )}
      </div>

      <div className="wizard-field-group">
        <label htmlFor="chapter-number">Chapter Number</label>
        <input
          id="chapter-number"
          type="number"
          value={data.chapterNumber}
          readOnly
          className="readonly-input"
        />
      </div>

    </div>
  );
}

export default ChapterBasicsStep;
