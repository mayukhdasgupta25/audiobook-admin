import ImageUploadZone from '../../../../../components/common/ImageUploadZone';
import type { ChapterWizardData } from '../../../../../types/audiobook';

interface ChapterContentAssetsStepProps {
  data: ChapterWizardData;
  errors: Partial<Record<keyof ChapterWizardData, string>>;
  isLoading?: boolean;
  onChange: (updates: Partial<ChapterWizardData>) => void;
}

function ChapterContentAssetsStep({
  data,
  errors,
  isLoading = false,
  onChange,
}: ChapterContentAssetsStepProps) {
  return (
    <div className="wizard-step-form">
      <div className="wizard-field-group">
        <label>
          Cover Image <span className="wizard-required">*</span>
        </label>
        <ImageUploadZone
          value={data.coverImage}
          onChange={coverImage => onChange({ coverImage })}
          disabled={isLoading}
          showPreview={false}
        />
        {errors.coverImage && (
          <span className="wizard-field-error">{errors.coverImage}</span>
        )}
      </div>

    </div>
  );
}

export default ChapterContentAssetsStep;
