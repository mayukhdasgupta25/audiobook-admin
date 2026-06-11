import { describe, expect, it } from 'vitest';
import {
  buildCreateAudiobookRequest,
  createEmptyAudiobookWizardData,
} from '../src/utils/audiobookWizard';

describe('audiobook wizard request builder', () => {
  it('omits paid and mood fields when not set', () => {
    const data = createEmptyAudiobookWizardData();
    data.title = 'Test Title';
    data.author = 'Test Author';
    data.description = 'Test description';
    data.genres = ['genre-1'];
    data.tags = ['tag-1'];

    const request = buildCreateAudiobookRequest(data);

    expect(request.isPublic).toBeUndefined();
    expect(request.minSubscriptionTier).toBeUndefined();
    expect(request.moodId).toBeUndefined();
  });

  it('includes paid fields when audiobook is paid', () => {
    const data = createEmptyAudiobookWizardData();
    data.title = 'Test Title';
    data.author = 'Test Author';
    data.description = 'Test description';
    data.genres = ['genre-1'];
    data.tags = ['tag-1'];
    data.isPaid = true;
    data.minSubscriptionTier = 2;

    const request = buildCreateAudiobookRequest(data);

    expect(request.isPublic).toBe(true);
    expect(request.minSubscriptionTier).toBe(2);
  });

  it('includes moodId when a mood is selected', () => {
    const data = createEmptyAudiobookWizardData();
    data.title = 'Test Title';
    data.author = 'Test Author';
    data.description = 'Test description';
    data.genres = ['genre-1'];
    data.tags = ['tag-1'];
    data.moodId = 'mood-1';

    const request = buildCreateAudiobookRequest(data);

    expect(request.moodId).toBe('mood-1');
  });
});
