import ImageUploadZone from '../../../../../components/common/ImageUploadZone';
import type { AudiobookWizardData } from '../../../../../types/audiobook';

interface ContentAssetsStepProps {
  data: AudiobookWizardData;
  errors: Partial<Record<keyof AudiobookWizardData, string>>;
  isLoading?: boolean;
  onChange: (updates: Partial<AudiobookWizardData>) => void;
}

function ContentAssetsStep({
  data,
  errors,
  isLoading = false,
  onChange,
}: ContentAssetsStepProps) {
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
          recommendedSizeHint="700 × 1000"
          ariaLabel="Upload cover image"
        />
        {errors.coverImage && (
          <span className="wizard-field-error">{errors.coverImage}</span>
        )}
      </div>

    </div>
  );
}

export default ContentAssetsStep;
