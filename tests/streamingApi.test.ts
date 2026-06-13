import { describe, expect, it } from 'vitest';
import { computeStreamBadge } from '../src/utils/streamingApi';
import type { ChapterTranscodingStatus } from '../src/types/streaming';

describe('streamingApi', () => {
  it('computeStreamBadge shows average progress while processing', () => {
    const status: ChapterTranscodingStatus = {
      chapterId: 'ch-1',
      canStream: false,
      masterPlaylistReady: false,
      aggregateStatus: 'processing',
      bitrates: [
        { bitrate: 64, status: 'processing', progress: 40 },
        { bitrate: 128, status: 'processing', progress: 60 },
      ],
    };

    expect(computeStreamBadge(status).label).toBe('Processing (50%)');
  });

  it('parses transcoding event shape with progress field', () => {
    const raw = {
      chapterId: 'ch-1',
      bitrate: 128,
      status: 'processing' as const,
      progress: 47,
      timestamp: '2026-06-13T10:00:00.000Z',
    };

    expect(raw.progress).toBe(47);
    expect(raw.status).toBe('processing');
  });
});
