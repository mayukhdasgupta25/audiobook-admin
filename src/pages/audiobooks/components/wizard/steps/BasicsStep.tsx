import { AlignLeft, BookOpen, Globe, Sparkles, Wallet } from 'lucide-react';
import PillSwitch from '../../../../../components/common/PillSwitch';
import WizardFieldLabel from '../../../../../components/wizard/WizardFieldLabel';
import WizardSinglePillSelector from '../../../../../components/wizard/WizardSinglePillSelector';
import type { AudiobookWizardData } from '../../../../../types/audiobook';
import { AUDIOBOOK_LANGUAGE_OPTIONS } from '../../../../../utils/audiobookWizard';
import { buildSubscriptionPlanSelectOptions } from '../../../../../utils/subscriptionPlans';
import type {
  GenreItem,
  MoodItem,
  SubscriptionPlanItem,
  TagItem,
} from '../../../../../utils/audiobookApi';
import GenreTagSelectors from '../fields/GenreTagSelectors';

interface BasicsStepProps {
  data: AudiobookWizardData;
  errors: Partial<Record<keyof AudiobookWizardData, string>>;
  genres: GenreItem[];
  tags: TagItem[];
  moods: MoodItem[];
  subscriptionPlans: SubscriptionPlanItem[];
  genresLoading: boolean;
  tagsLoading: boolean;
  moodsLoading: boolean;
  subscriptionPlansLoading: boolean;
  isLoading?: boolean;
  onChange: (updates: Partial<AudiobookWizardData>) => void;
}

function BasicsStep({
  data,
  errors,
  genres,
  tags,
  moods,
  subscriptionPlans,
  genresLoading,
  tagsLoading,
  moodsLoading,
  subscriptionPlansLoading,
  isLoading = false,
  onChange,
}: BasicsStepProps) {
  const subscriptionPlanOptions = buildSubscriptionPlanSelectOptions(
    subscriptionPlans ?? []
  );

  const moodOptions = (moods ?? []).map(mood => ({
    id: mood.id,
    label: mood.name,
  }));

  return (
    <div className="wizard-step-form">
      <div className="wizard-field-group">
        <WizardFieldLabel htmlFor="audiobook-title" icon={BookOpen} required>
          Audiobook Title
        </WizardFieldLabel>
        <input
          id="audiobook-title"
          type="text"
          value={data.title}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="Enter audiobook title"
          disabled={isLoading}
        />
        {errors.title && (
          <span className="wizard-field-error">{errors.title}</span>
        )}
      </div>

      <div className="wizard-description-genres-row">
        <div className="wizard-field-group wizard-description-col">
          <WizardFieldLabel
            htmlFor="audiobook-description"
            icon={AlignLeft}
            required
          >
            Short Description
          </WizardFieldLabel>
          <textarea
            id="audiobook-description"
            value={data.description}
            onChange={e => onChange({ description: e.target.value })}
            placeholder="Enter audiobook description"
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
          <span className="wizard-field-hint">
            {data.description.length}/500 characters
          </span>
          {errors.description && (
            <span className="wizard-field-error">{errors.description}</span>
          )}
        </div>

        <GenreTagSelectors
          genres={genres}
          tags={tags}
          selectedGenres={data.genres}
          selectedTags={data.tags}
          genresLoading={genresLoading}
          genreError={errors.genres}
          showGenres
          showTags={false}
          onGenreToggle={genreId => {
            const next = data.genres.includes(genreId)
              ? data.genres.filter(id => id !== genreId)
              : [...data.genres, genreId];
            onChange({ genres: next });
          }}
          onTagToggle={() => undefined}
        />
      </div>

      <GenreTagSelectors
        genres={genres}
        tags={tags}
        selectedGenres={data.genres}
        selectedTags={data.tags}
        tagsLoading={tagsLoading}
        tagError={errors.tags}
        showGenres={false}
        showTags
        onGenreToggle={() => undefined}
        onTagToggle={tagId => {
          const next = data.tags.includes(tagId)
            ? data.tags.filter(id => id !== tagId)
            : [...data.tags, tagId];
          onChange({ tags: next });
        }}
      />

      <div className="wizard-field-group">
        <WizardFieldLabel htmlFor="audiobook-language" icon={Globe}>
          Language
        </WizardFieldLabel>
        <select
          id="audiobook-language"
          value={data.language}
          onChange={e => onChange({ language: e.target.value })}
          disabled={isLoading}
        >
          {AUDIOBOOK_LANGUAGE_OPTIONS.map(language => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="wizard-field-group">
        <div className="wizard-paid-plan-layout">
          <div className="wizard-paid-switch">
            <PillSwitch
              id="audiobook-paid-switch"
              label="Paid"
              checked={data.isPaid}
              disabled={isLoading}
              onChange={checked => {
                if (checked) {
                  onChange({ isPaid: true });
                } else {
                  onChange({ isPaid: false, minSubscriptionTier: null });
                }
              }}
            />
          </div>
          {data.isPaid && (
            <div className="wizard-paid-plan-content">
              <WizardFieldLabel
                htmlFor="audiobook-subscription-plan"
                icon={Wallet}
                required
              >
                Subscription plan
              </WizardFieldLabel>
              <div className="wizard-paid-plan-dropdown">
                <select
                  id="audiobook-subscription-plan"
                  value={
                    data.minSubscriptionTier != null
                      ? String(data.minSubscriptionTier)
                      : ''
                  }
                  onChange={e => {
                    const tier = e.target.value ? Number(e.target.value) : null;
                    onChange({
                      minSubscriptionTier:
                        tier != null && !Number.isNaN(tier) ? tier : null,
                    });
                  }}
                  disabled={
                    isLoading || !data.isPaid || subscriptionPlansLoading
                  }
                  aria-invalid={Boolean(errors.minSubscriptionTier)}
                >
                  <option value="">
                    {subscriptionPlansLoading
                      ? 'Loading plans...'
                      : 'Select a subscription plan'}
                  </option>
                  {subscriptionPlanOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.minSubscriptionTier && (
                  <span className="wizard-field-error">
                    {errors.minSubscriptionTier}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="wizard-field-group">
        <WizardFieldLabel icon={Sparkles}>Mood</WizardFieldLabel>
        {moodsLoading ? (
          <span className="wizard-field-hint">Loading moods...</span>
        ) : moodOptions.length > 0 ? (
          <WizardSinglePillSelector
            name="audiobook-mood"
            options={moodOptions}
            value={data.moodId}
            onChange={moodId => onChange({ moodId })}
            disabled={isLoading}
          />
        ) : (
          <span className="wizard-field-hint">No moods available</span>
        )}
      </div>
    </div>
  );
}

export default BasicsStep;
