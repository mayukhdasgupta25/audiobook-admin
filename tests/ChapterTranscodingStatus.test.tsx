import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChapterTranscodingStatus from '../src/pages/chapters/components/ChapterTranscodingStatus';
import type { ChapterTranscodingStatus as Status } from '../src/types/streaming';

vi.mock('../src/utils/streamingApi', () => ({
  retryChapterTranscoding: vi.fn(),
}));

describe('ChapterTranscodingStatus', () => {
  it('renders live progress percentage and bar width', () => {
    const status: Status = {
      chapterId: 'ch-1',
      canStream: false,
      masterPlaylistReady: false,
      aggregateStatus: 'processing',
      bitrates: [{ bitrate: 128, status: 'processing', progress: 47 }],
    };

    render(<ChapterTranscodingStatus chapterId="ch-1" status={status} />);

    expect(screen.getByText('47%')).toBeInTheDocument();
    expect(screen.getByText(/128k — Transcoding: Ongoing/)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '47');
  });

  it('shows completed state at 100%', () => {
    const status: Status = {
      chapterId: 'ch-1',
      canStream: true,
      masterPlaylistReady: true,
      aggregateStatus: 'completed',
      bitrates: [{ bitrate: 256, status: 'completed', progress: 100 }],
    };

    render(<ChapterTranscodingStatus chapterId="ch-1" status={status} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(/256k — Transcoding: Completed/)).toBeInTheDocument();
  });
});
