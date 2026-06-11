import { formatDurationDetailed } from '../../../../../utils/formatting';
import type { ChapterWizardData } from '../../../../../types/audiobook';

interface ChapterReviewPublishStepProps {
  data: ChapterWizardData;
}

function ChapterReviewPublishStep({ data }: ChapterReviewPublishStepProps) {
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
    </div>
  );
}

export default ChapterReviewPublishStep;
