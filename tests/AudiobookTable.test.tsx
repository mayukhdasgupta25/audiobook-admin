import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AudiobookTable from '../src/pages/audiobooks/components/AudiobookTable';
import type { AudiobookApiResponse } from '../src/types/audiobook';
import '../src/styles/pages/audiobooks/components/AudiobookTable.css';

const baseAudiobook: AudiobookApiResponse = {
  id: 'ab-1',
  title: 'Audiobook One',
  author: 'Author',
  description: 'Description',
};

describe('AudiobookTable subscription column', () => {
  it('shows Free when no subscription tier is set', () => {
    render(
      <AudiobookTable
        audiobooks={[{ ...baseAudiobook, minSubscriptionTier: null }]}
        filter="live"
        onRowClick={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />
    );

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Subscription' })).toBeInTheDocument();
  });

  it('shows chapter count from API response', () => {
    render(
      <AudiobookTable
        audiobooks={[
          { ...baseAudiobook, chapterCount: 3 },
          { ...baseAudiobook, id: 'ab-2', title: 'Audiobook Two', chapterCount: 0 },
        ]}
        filter="all"
        onRowClick={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows tier labels for paid audiobooks', () => {
    render(
      <AudiobookTable
        audiobooks={[
          { ...baseAudiobook, id: 'ab-1', minSubscriptionTier: 2 },
          { ...baseAudiobook, id: 'ab-2', title: 'Audiobook Two', minSubscriptionTier: 3 },
        ]}
        filter="all"
        onRowClick={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />
    );

    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });
});
