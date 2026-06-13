import { describe, expect, it } from 'vitest';
import transcodingReducer, {
  clearChapterTranscodingRefreshQueue,
  clearTranscodingForChapter,
  markBitrateRetrying,
  mergeChapterTranscodingStatuses,
  queueChapterTranscodingRefresh,
  setTranscodingConnected,
} from '../src/store/slices/transcodingSlice';
import type { ChapterTranscodingStatus } from '../src/types/streaming';

const completeStatus: ChapterTranscodingStatus = {
  chapterId: 'ch-1',
  canStream: true,
  masterPlaylistReady: true,
  aggregateStatus: 'completed',
  bitrates: [
    { bitrate: 64, status: 'completed', progress: 100 },
    { bitrate: 128, status: 'completed', progress: 100 },
    { bitrate: 256, status: 'completed', progress: 100 },
  ],
};

describe('transcodingSlice', () => {
  it('merges chapter transcoding statuses by chapterId', () => {
    const next = transcodingReducer(
      undefined,
      mergeChapterTranscodingStatuses([completeStatus])
    );

    expect(next.statusByChapterId['ch-1']).toEqual(completeStatus);
  });

  it('updates connected flag', () => {
    const next = transcodingReducer(undefined, setTranscodingConnected(false));
    expect(next.connected).toBe(false);
  });

  it('marks a failed bitrate as pending after retry', () => {
    const initial = transcodingReducer(
      undefined,
      mergeChapterTranscodingStatuses([
        {
          chapterId: 'ch-1',
          canStream: false,
          masterPlaylistReady: false,
          aggregateStatus: 'failed',
          bitrates: [
            { bitrate: 128, status: 'failed', progress: 0, errorMessage: 'Error' },
          ],
        },
      ])
    );

    const next = transcodingReducer(
      initial,
      markBitrateRetrying({ chapterId: 'ch-1', bitrate: 128 })
    );

    expect(next.statusByChapterId['ch-1']?.bitrates[0]).toEqual({
      bitrate: 128,
      status: 'pending',
      progress: 0,
      errorMessage: undefined,
    });
    expect(next.statusByChapterId['ch-1']?.aggregateStatus).toBe('processing');
  });

  it('queues and clears chapter refresh requests', () => {
    const queued = transcodingReducer(
      undefined,
      queueChapterTranscodingRefresh('ch-1')
    );
    expect(queued.refreshChapterIds).toEqual(['ch-1']);

    const cleared = transcodingReducer(
      queued,
      clearChapterTranscodingRefreshQueue()
    );
    expect(cleared.refreshChapterIds).toEqual([]);
  });

  it('removes transcoding state when a chapter is deleted', () => {
    const initial = transcodingReducer(
      undefined,
      mergeChapterTranscodingStatuses([completeStatus])
    );

    const next = transcodingReducer(initial, clearTranscodingForChapter('ch-1'));
    expect(next.statusByChapterId['ch-1']).toBeUndefined();
  });
});
