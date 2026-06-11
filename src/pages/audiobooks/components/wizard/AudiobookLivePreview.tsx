import WizardLivePreviewHeader from '../../../../components/wizard/WizardLivePreviewHeader';
import type { AudiobookWizardData } from '../../../../types/audiobook';
import type { GenreItem, TagItem } from '../../../../utils/audiobookApi';
import { filterAudiobookMeta } from '../../../../utils/audiobookWizard';
import '../../../../styles/pages/audiobooks/components/AudiobookCard.css';

interface AudiobookLivePreviewProps {
  data: AudiobookWizardData;
  coverPreviewUrl: string | null;
  genres: GenreItem[];
  tags: TagItem[];
}

function AudiobookLivePreview({
  data,
  coverPreviewUrl,
  genres,
  tags,
}: AudiobookLivePreviewProps) {
  const genreNames = data.genres
    .map(id => genres.find(g => g.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const tagNames = data.tags
    .map(id => tags.find(t => t.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const metaEntries = Object.entries(filterAudiobookMeta(data.meta));

  return (
    <div className="wizard-preview-card">
      <WizardLivePreviewHeader subtitle="This is how your audiobook will appear" />

      <div className="audiobook-card audiobook-card--preview">
        <div className="audiobook-card-cover">
          {coverPreviewUrl ? (
            <img src={coverPreviewUrl} alt={data.title || 'Cover preview'} />
          ) : (
            <div className="audiobook-card-placeholder">
              <span>📚</span>
            </div>
          )}
        </div>
        <div className="audiobook-card-content">
          <h3 className="audiobook-card-title">
            {data.title || 'Untitled Audiobook'}
          </h3>
          <p className="audiobook-card-author">
            {data.author ? `by ${data.author}` : 'by Author name'}
          </p>
          {data.narrators.length > 0 && (
            <p className="audiobook-card-preview-detail">
              Narrated by {data.narrators.join(', ')}
            </p>
          )}
          <div className="audiobook-card-badges">
            {genreNames.map(name => (
              <span
                key={name}
                className="audiobook-card-badge audiobook-card-badge-genre"
              >
                {name}
              </span>
            ))}
            {tagNames.map(name => (
              <span
                key={name}
                className="audiobook-card-badge audiobook-card-badge-tag"
              >
                {name}
              </span>
            ))}
          </div>
          {data.language && (
            <p className="audiobook-card-preview-detail">
              Language: {data.language}
            </p>
          )}
          {data.description && (
            <p className="audiobook-card-preview-detail">
              {data.description.length > 120
                ? `${data.description.slice(0, 120)}...`
                : data.description}
            </p>
          )}
          {metaEntries.map(([key, value]) => (
            <p key={key} className="audiobook-card-preview-detail">
              {key}: {value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AudiobookLivePreview;
