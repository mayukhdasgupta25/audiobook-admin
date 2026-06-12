import { describe, expect, it } from 'vitest';
import {
  buildCreateAudiobookRequest,
  createEmptyAudiobookWizardData,
  hydrateAudiobookWizardData,
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

    expect(request.isPublic).toBe(true);
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

    expect(request.isPublic).toBe(false);
    expect(request.minSubscriptionTier).toBe(2);
  });

  it('hydrates paid state from isPublic false', () => {
    const data = hydrateAudiobookWizardData(
      {
        id: 'ab-1',
        title: 'Paid Book',
        author: 'Author',
        description: 'Description',
        isPublic: false,
      },
      [],
      []
    );

    expect(data.isPaid).toBe(true);
  });

  it('hydrates free state from isPublic true', () => {
    const data = hydrateAudiobookWizardData(
      {
        id: 'ab-2',
        title: 'Free Book',
        author: 'Author',
        description: 'Description',
        isPublic: true,
      },
      [],
      []
    );

    expect(data.isPaid).toBe(false);
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
