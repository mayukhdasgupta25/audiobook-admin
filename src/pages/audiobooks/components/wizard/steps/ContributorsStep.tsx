import type { AudiobookWizardData } from '../../../../../types/audiobook';
import MetaKeyValueEditor from '../fields/MetaKeyValueEditor';
import NarratorChipInput from '../fields/NarratorChipInput';

interface ContributorsStepProps {
  data: AudiobookWizardData;
  errors: Partial<Record<keyof AudiobookWizardData, string>>;
  isLoading?: boolean;
  onChange: (updates: Partial<AudiobookWizardData>) => void;
}

function ContributorsStep({
  data,
  errors,
  isLoading = false,
  onChange,
}: ContributorsStepProps) {
  return (
    <div className="wizard-step-form">
      <div className="wizard-field-group">
        <label htmlFor="audiobook-author">
          Author <span className="wizard-required">*</span>
        </label>
        <input
          id="audiobook-author"
          type="text"
          value={data.author}
          onChange={e => onChange({ author: e.target.value })}
          placeholder="Enter author name"
          disabled={isLoading}
        />
        {errors.author && (
          <span className="wizard-field-error">{errors.author}</span>
        )}
      </div>

      <NarratorChipInput
        narrators={data.narrators}
        onChange={narrators => onChange({ narrators })}
        disabled={isLoading}
      />

      <MetaKeyValueEditor
        meta={data.meta}
        onChange={meta => onChange({ meta })}
      />

    </div>
  );
}

export default ContributorsStep;
