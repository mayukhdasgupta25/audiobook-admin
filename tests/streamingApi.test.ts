import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  chapterNeedsTranscodingPoll,
  computeStreamBadge,
  fetchChapterTranscodingEventSnapshots,
  getBitrateRow,
  pollChapterTranscodingUpdates,
} from '../src/utils/streamingApi';
import type { ChapterTranscodingStatus } from '../src/types/streaming';

vi.mock('../src/utils/config', () => ({
  getContentApiBaseUrl: () => 'https://stream.test',
  getAuthHeaders: () => ({ Authorization: 'Bearer test-token' }),
}));

describe('streamingApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('computeStreamBadge shows average progress while processing', () => {
    const status: ChapterTranscodingStatus = {
      chapterId: 'ch-1',
      canStream: false,
      masterPlaylistReady: false,
      aggregateStatus: 'processing',
      bitrates: [
        { bitrate: 64, status: 'processing', progress: 40 },
        { bitrate: 128, status: 'processing', progress: 60 },
        { bitrate: 256, status: 'processing', progress: 50 },
      ],
    };

    expect(computeStreamBadge(status).label).toBe('Processing (50%)');
  });

  it('computeStreamBadge shows Ready when all target bitrates are complete even if aggregate fields are stale', () => {
    const status: ChapterTranscodingStatus = {
      chapterId: 'ch-1',
      canStream: false,
      masterPlaylistReady: false,
      aggregateStatus: 'processing',
      bitrates: [
        { bitrate: 64, status: 'completed', progress: 100 },
        { bitrate: 128, status: 'completed', progress: 100 },
        { bitrate: 256, status: 'completed', progress: 100 },
      ],
    };

    expect(computeStreamBadge(status)).toEqual({
      label: 'Ready',
      className: 'chapter-stream-badge-ready',
    });
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

  it('pollChapterTranscodingUpdates fetches status and event snapshots together', async () => {
    const statusPayload: ChapterTranscodingStatus = {
      chapterId: 'ch-1',
      canStream: false,
      masterPlaylistReady: false,
      aggregateStatus: 'processing',
      bitrates: [{ bitrate: 128, status: 'processing', progress: 47 }],
    };

    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('/chapters/ch-1/transcoding')) {
        return {
          ok: true,
          json: async () => ({ data: statusPayload }),
        };
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              'event: snapshot\n' +
                `data: ${JSON.stringify({
                  chapterId: 'ch-1',
                  bitrates: [{ bitrate: 128, status: 'processing', progress: 47 }],
                  timestamp: '2026-06-13T10:00:00.000Z',
                })}\n\n`
            )
          );
          controller.close();
        },
      });

      return {
        ok: true,
        body: stream,
      };
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await pollChapterTranscodingUpdates(['ch-1']);

    expect(result.statuses).toHaveLength(1);
    expect(result.statuses[0]?.status).toBe('fulfilled');
    expect(result.snapshots).toHaveLength(1);
    expect(result.hasServerError).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toContain('/chapters/ch-1/transcoding');
    expect(fetchMock.mock.calls[1]?.[0]).toContain('/transcoding/events');
  });

  it('fetchChapterTranscodingEventSnapshots closes the stream after snapshots', async () => {
    const cancel = vi.fn(async () => undefined);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'event: snapshot\n' +
              `data: ${JSON.stringify({
                chapterId: 'ch-1',
                bitrates: [{ bitrate: 64, status: 'processing', progress: 10 }],
                timestamp: '2026-06-13T10:00:00.000Z',
              })}\n\n`
          )
        );
      },
      cancel,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        body: stream,
      }))
    );

    const snapshots = await fetchChapterTranscodingEventSnapshots(['ch-1']);

    expect(snapshots).toHaveLength(1);
    expect(cancel).toHaveBeenCalled();
  });

  it('pollChapterTranscodingUpdates flags server errors from status API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.endsWith('/chapters/ch-1/transcoding')) {
          return { ok: false, status: 503 };
        }

        return { ok: false, status: 503 };
      })
    );

    const result = await pollChapterTranscodingUpdates(['ch-1']);

    expect(result.hasServerError).toBe(true);
    expect(result.statuses[0]?.status).toBe('rejected');
  });

  it('pollChapterTranscodingUpdates flags server errors from events API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.endsWith('/chapters/ch-1/transcoding')) {
          return {
            ok: true,
            json: async () => ({
              data: {
                chapterId: 'ch-1',
                canStream: false,
                masterPlaylistReady: false,
                aggregateStatus: 'processing',
                bitrates: [],
              },
            }),
          };
        }

        return { ok: false, status: 500 };
      })
    );

    const result = await pollChapterTranscodingUpdates(['ch-1']);

    expect(result.hasServerError).toBe(true);
    expect(result.snapshots).toEqual([]);
  });

  it('getBitrateRow returns pending defaults when bitrate is missing', () => {
    const row = getBitrateRow(undefined, 128);
    expect(row).toEqual({
      bitrate: 128,
      status: 'pending',
      progress: 0,
    });
  });

  it('getBitrateRow returns matching bitrate from status', () => {
    const row = getBitrateRow(
      {
        chapterId: 'ch-1',
        canStream: false,
        masterPlaylistReady: false,
        aggregateStatus: 'processing',
        bitrates: [{ bitrate: 64, status: 'processing', progress: 33 }],
      },
      64
    );
    expect(row.progress).toBe(33);
    expect(row.status).toBe('processing');
  });

  it('chapterNeedsTranscodingPoll returns true when status is unknown', () => {
    expect(chapterNeedsTranscodingPoll(undefined)).toBe(true);
  });

  it('chapterNeedsTranscodingPoll returns false when all target bitrates are complete', () => {
    expect(
      chapterNeedsTranscodingPoll({
        chapterId: 'ch-1',
        canStream: true,
        masterPlaylistReady: true,
        aggregateStatus: 'completed',
        bitrates: [
          { bitrate: 64, status: 'completed', progress: 100 },
          { bitrate: 128, status: 'completed', progress: 100 },
          { bitrate: 256, status: 'completed', progress: 100 },
        ],
      })
    ).toBe(false);
  });

  it('chapterNeedsTranscodingPoll returns true when a bitrate is still processing', () => {
    expect(
      chapterNeedsTranscodingPoll({
        chapterId: 'ch-1',
        canStream: false,
        masterPlaylistReady: false,
        aggregateStatus: 'processing',
        bitrates: [
          { bitrate: 64, status: 'completed', progress: 100 },
          { bitrate: 128, status: 'processing', progress: 50 },
          { bitrate: 256, status: 'completed', progress: 100 },
        ],
      })
    ).toBe(true);
  });

  it('chapterNeedsTranscodingPoll returns false when only incomplete bitrates are failed', () => {
    expect(
      chapterNeedsTranscodingPoll({
        chapterId: 'ch-1',
        canStream: false,
        masterPlaylistReady: false,
        aggregateStatus: 'failed',
        bitrates: [
          { bitrate: 64, status: 'completed', progress: 100 },
          { bitrate: 128, status: 'failed', progress: 50 },
          { bitrate: 256, status: 'completed', progress: 100 },
        ],
      })
    ).toBe(false);
  });

  it('chapterNeedsTranscodingPoll returns true when one bitrate failed and another is processing', () => {
    expect(
      chapterNeedsTranscodingPoll({
        chapterId: 'ch-1',
        canStream: false,
        masterPlaylistReady: false,
        aggregateStatus: 'partial',
        bitrates: [
          { bitrate: 64, status: 'failed', progress: 20 },
          { bitrate: 128, status: 'processing', progress: 40 },
          { bitrate: 256, status: 'completed', progress: 100 },
        ],
      })
    ).toBe(true);
  });
});
