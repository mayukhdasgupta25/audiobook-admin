import { Layers, Tag } from 'lucide-react';
import MultiPillSelector from '../../../../../components/wizard/MultiPillSelector';
import WizardFieldLabel from '../../../../../components/wizard/WizardFieldLabel';
import type { GenreItem, TagItem } from '../../../../../utils/audiobookApi';

interface GenreTagSelectorsProps {
  genres: GenreItem[];
  tags: TagItem[];
  selectedGenres: string[];
  selectedTags: string[];
  genresLoading?: boolean;
  tagsLoading?: boolean;
  genreError?: string;
  tagError?: string;
  showGenres?: boolean;
  showTags?: boolean;
  onGenreToggle: (genreId: string) => void;
  onTagToggle: (tagId: string) => void;
}

function GenreTagSelectors({
  genres,
  tags,
  selectedGenres,
  selectedTags,
  genresLoading = false,
  tagsLoading = false,
  genreError,
  tagError,
  showGenres = true,
  showTags = true,
  onGenreToggle,
  onTagToggle,
}: GenreTagSelectorsProps) {
  return (
    <>
      {showGenres && (
        <div className="wizard-field-group wizard-genres-col">
          <WizardFieldLabel icon={Layers} required>
            Genres
          </WizardFieldLabel>
          {genresLoading ? (
            <div className="loading-message">Loading genres...</div>
          ) : (
            <MultiPillSelector
              name="audiobook-genres"
              options={genres.map(genre => ({
                id: genre.id,
                label: genre.name,
              }))}
              selected={selectedGenres}
              onToggle={onGenreToggle}
              hasError={Boolean(genreError)}
            />
          )}
          {genreError && (
            <span className="wizard-field-error">{genreError}</span>
          )}
        </div>
      )}

      {showTags && (
        <div className="wizard-field-group">
          <WizardFieldLabel icon={Tag} required>
            Tags
          </WizardFieldLabel>
          {tagsLoading ? (
            <div className="loading-message">Loading tags...</div>
          ) : (
            <MultiPillSelector
              name="audiobook-tags"
              options={tags.map(tag => ({
                id: tag.id,
                label: tag.name,
              }))}
              selected={selectedTags}
              onToggle={onTagToggle}
              hasError={Boolean(tagError)}
            />
          )}
          {tagError && <span className="wizard-field-error">{tagError}</span>}
        </div>
      )}
    </>
  );
}

export default GenreTagSelectors;
