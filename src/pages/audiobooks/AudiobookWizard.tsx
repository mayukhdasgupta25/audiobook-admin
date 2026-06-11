import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import WizardShell from '../../components/wizard/WizardShell';
import type { WizardStepConfig } from '../../components/wizard/WizardStepper';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchGenres } from '../../store/slices/genresSlice';
import { fetchTags } from '../../store/slices/tagsSlice';
import {
  createAudiobookThunk,
  fetchAudiobooks,
  updateAudiobookThunk,
} from '../../store/slices/audiobooksSlice';
import type { AudiobookApiResponse, AudiobookWizardData } from '../../types/audiobook';
import { getOrganizations } from '../../utils/audiobookApi';
import { isPartnerApp } from '../../utils/config';
import { showApiError } from '../../utils/toast';
import {
  buildCreateAudiobookRequest,
  buildUpdateAudiobookRequest,
  createEmptyAudiobookWizardData,
  hydrateAudiobookWizardData,
  validateAudiobookForPublish,
  validateAudiobookForSchedule,
  validateAudiobookStep,
  type AudiobookWizardStep,
} from '../../utils/audiobookWizard';
import AudiobookLivePreview from './components/wizard/AudiobookLivePreview';
import BasicsStep from './components/wizard/steps/BasicsStep';
import ContributorsStep from './components/wizard/steps/ContributorsStep';
import ContentAssetsStep from './components/wizard/steps/ContentAssetsStep';
import ReviewPublishStep from './components/wizard/steps/ReviewPublishStep';
import '../../styles/components/wizard/WizardShell.css';

const AUDIOBOOK_STEPS: WizardStepConfig[] = [
  { label: 'Basics', description: 'Tell us the essentials', icon: FileText },
  { label: 'Contributors', description: 'Add authors & details', icon: Users },
  {
    label: 'Content & Assets',
    description: 'Upload cover image',
    icon: ImageIcon,
  },
  {
    label: 'Review & Publish',
    description: 'Finalize and publish',
    icon: BookOpen,
  },
];

const DRAFT_STORAGE_KEY = 'audiobook-wizard-draft';

function AudiobookWizard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const partnerApp = isPartnerApp();
  const mode = id ? 'edit' : 'create';

  const { genres, loading: genresLoading } = useAppSelector(
    state => state.genres
  );
  const { tags, loading: tagsLoading } = useAppSelector(state => state.tags);
  const { loading, filter } = useAppSelector(state => state.audiobooks);

  const editingAudiobook = (location.state as { audiobook?: AudiobookApiResponse })
    ?.audiobook;

  const [step, setStep] = useState<AudiobookWizardStep>(1);
  const [data, setData] = useState<AudiobookWizardData>(
    createEmptyAudiobookWizardData()
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof AudiobookWizardData | 'scheduledAt', string>>
  >({});
  const [scheduleMode, setScheduleMode] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [organizationId, setOrganizationId] = useState('');
  const [organizationError, setOrganizationError] = useState('');

  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
    if (tags.length === 0) {
      dispatch(fetchTags());
    }
  }, [dispatch, genres.length, tags.length]);

  useEffect(() => {
    if (mode === 'edit' && editingAudiobook && genres.length > 0 && tags.length > 0) {
      setData(hydrateAudiobookWizardData(editingAudiobook, genres, tags));
    }
  }, [mode, editingAudiobook, genres, tags]);

  useEffect(() => {
    if (partnerApp || mode === 'edit') {
      return;
    }

    const fetchOrganization = async () => {
      try {
        const memberships = await getOrganizations();
        const membership = memberships[0];
        if (membership?.organization) {
          setOrganizationId(membership.organization.id);
        } else {
          setOrganizationError('No organization found for your account');
        }
      } catch (error) {
        showApiError(error);
        setOrganizationError('Failed to load organization');
      }
    };

    void fetchOrganization();
  }, [partnerApp, mode]);

  const coverPreviewUrl = useMemo(() => {
    if (data.coverImage) {
      return URL.createObjectURL(data.coverImage);
    }
    return data.existingCoverUrl ?? null;
  }, [data.coverImage, data.existingCoverUrl]);

  useEffect(() => {
    return () => {
      if (data.coverImage && coverPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [data.coverImage, coverPreviewUrl]);

  const updateData = (updates: Partial<AudiobookWizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
    setDraftSaved(false);
  };

  const validateCurrentStep = (): boolean => {
    const stepErrors = validateAudiobookStep(step, data, mode);
    setErrors(stepErrors);
    if (step === 1 && organizationError && mode === 'create' && !partnerApp) {
      return false;
    }
    return Object.keys(stepErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateCurrentStep()) {
      return;
    }
    setStep(prev => Math.min(4, prev + 1) as AudiobookWizardStep);
  };

  const handleBack = () => {
    setErrors({});
    setStep(prev => Math.max(1, prev - 1) as AudiobookWizardStep);
  };

  const handleSaveDraft = () => {
    const { coverImage: _cover, ...draft } = data;
    void _cover;
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setDraftSaved(true);
    toast.success('Draft saved');
  };

  const submitAudiobook = async (scheduled: boolean) => {
    const submissionData = {
      ...data,
      scheduledAt: scheduled ? data.scheduledAt : undefined,
    };
    const validationErrors = scheduled
      ? validateAudiobookForSchedule(submissionData)
      : validateAudiobookForPublish(submissionData, mode);

    if (
      Object.keys(validationErrors).length > 0 ||
      (mode === 'create' && !partnerApp && !organizationId)
    ) {
      setErrors(validationErrors);
      if (!partnerApp && !organizationId && mode === 'create') {
        setOrganizationError('Organization is required');
      }
      return;
    }

    try {
      if (mode === 'edit' && id) {
        await dispatch(
          updateAudiobookThunk(buildUpdateAudiobookRequest(id, submissionData))
        ).unwrap();
      } else {
        await dispatch(
          createAudiobookThunk(
            buildCreateAudiobookRequest(
              submissionData,
              partnerApp ? undefined : organizationId
            )
          )
        ).unwrap();
      }
      await dispatch(fetchAudiobooks({ page: 1, filter }));
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      navigate('/audiobooks');
    } catch (error) {
      showApiError(error);
    }
  };

  const title =
    mode === 'edit' ? 'Edit Audiobook' : 'Create New Audiobook';
  const subtitle =
    mode === 'edit'
      ? 'Update your audiobook details across guided steps.'
      : "Let's set up your audiobook in a few guided steps.";

  return (
    <WizardShell
      title={title}
      subtitle={subtitle}
      mode={mode}
      currentStep={step}
      totalSteps={4}
      steps={AUDIOBOOK_STEPS}
      draftSaved={draftSaved}
      isLoading={loading}
      preview={
        <AudiobookLivePreview
          data={data}
          coverPreviewUrl={coverPreviewUrl}
          genres={genres}
          tags={tags}
        />
      }
      onCancel={() => navigate('/audiobooks')}
      onSaveDraft={mode === 'create' ? handleSaveDraft : undefined}
      onBack={step > 1 ? handleBack : undefined}
      onContinue={step < 4 ? handleContinue : undefined}
      onPublish={step === 4 ? () => void submitAudiobook(false) : undefined}
      onSchedule={
        step === 4 && scheduleMode
          ? () => void submitAudiobook(true)
          : undefined
      }
      showBack={step > 1}
      showContinue={step < 4}
      showPublishActions={step === 4}
    >
      {organizationError && step === 1 && mode === 'create' && !partnerApp && (
        <p className="wizard-field-error">{organizationError}</p>
      )}

      {step === 1 && (
        <BasicsStep
          data={data}
          errors={errors}
          genres={genres}
          tags={tags}
          genresLoading={genresLoading}
          tagsLoading={tagsLoading}
          isLoading={loading}
          onChange={updateData}
        />
      )}
      {step === 2 && (
        <ContributorsStep
          data={data}
          errors={errors}
          isLoading={loading}
          onChange={updateData}
        />
      )}
      {step === 3 && (
        <ContentAssetsStep
          data={data}
          errors={errors}
          isLoading={loading}
          onChange={updateData}
        />
      )}
      {step === 4 && (
        <ReviewPublishStep
          data={data}
          errors={errors}
          genres={genres}
          tags={tags}
          scheduleMode={scheduleMode}
          onScheduleModeChange={setScheduleMode}
          onChange={updateData}
        />
      )}
    </WizardShell>
  );
}

export default AudiobookWizard;
