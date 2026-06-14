import WizardLivePreviewHeader from '../../../../components/wizard/WizardLivePreviewHeader';
import { formatDurationDetailed } from '../../../../utils/formatting';
import type { ChapterWizardData } from '../../../../types/audiobook';
import '../../../../styles/pages/chapters/components/ChapterCard.css';

interface ChapterLivePreviewProps {
  data: ChapterWizardData;
  coverPreviewUrl: string | null;
}

function ChapterLivePreview({ data, coverPreviewUrl }: ChapterLivePreviewProps) {
  return (
    <div className="wizard-preview-card">
      <WizardLivePreviewHeader subtitle="This is how your chapter will appear" />

      <div className="chapter-card chapter-card--preview">
        <div className="chapter-card-cover">
          {coverPreviewUrl ? (
            <img src={coverPreviewUrl} alt={data.title || 'Chapter cover'} />
          ) : (
            <div className="chapter-card-placeholder">
              <span>📖</span>
            </div>
          )}
        </div>
        <div className="chapter-card-content">
          <div className="chapter-card-header">
            <span className="chapter-card-number">
              Chapter {data.chapterNumber}
            </span>
          </div>
          <h3 className="chapter-card-title">
            {data.title || 'Untitled Chapter'}
          </h3>
          {data.description && (
            <p className="chapter-card-description">
              {data.description.length > 120
                ? `${data.description.slice(0, 120)}...`
                : data.description}
            </p>
          )}
          {data.duration !== undefined && (
            <p className="chapter-card-description">
              Duration: {formatDurationDetailed(data.duration)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterLivePreview;
