import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import transcodingReducer from '../src/store/slices/transcodingSlice';
import { useChapterTranscodingEvents } from '../src/hooks/useChapterTranscodingEvents';
import type { ChapterTranscodingStatus } from '../src/types/streaming';

const pollChapterTranscodingUpdatesMock = vi.fn();

vi.mock('../src/utils/streamingApi', async importOriginal => {
  const actual =
    await importOriginal<typeof import('../src/utils/streamingApi')>();
  return {
    ...actual,
    pollChapterTranscodingUpdates: (...args: unknown[]) =>
      pollChapterTranscodingUpdatesMock(...args),
  };
});

function createStore(
  preloadedState?: {
    transcoding: {
      statusByChapterId: Record<string, ChapterTranscodingStatus>;
      connected: boolean;
      refreshChapterIds: string[];
    };
  }
) {
  return configureStore({
    reducer: { transcoding: transcodingReducer },
    preloadedState,
  });
}

function renderTranscodingHook(chapterIds: string[], store = createStore()) {
  return renderHook(() => useChapterTranscodingEvents(chapterIds), {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(Provider, { store }, children),
  });
}

describe('useChapterTranscodingEvents', () => {
  beforeEach(() => {
    pollChapterTranscodingUpdatesMock.mockResolvedValue({
      statuses: [],
      snapshots: [],
      hasServerError: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('polls chapters without cached transcoding status', async () => {
    renderTranscodingHook(['ch-1', 'ch-2']);

    await waitFor(() => {
      expect(pollChapterTranscodingUpdatesMock).toHaveBeenCalledWith([
        'ch-1',
        'ch-2',
      ]);
    });
  });

  it('does not poll chapters where all target bitrates are complete', async () => {
    const store = createStore({
      transcoding: {
        statusByChapterId: {
          'ch-1': {
            chapterId: 'ch-1',
            canStream: true,
            masterPlaylistReady: true,
            aggregateStatus: 'completed',
            bitrates: [
              { bitrate: 64, status: 'completed', progress: 100 },
              { bitrate: 128, status: 'completed', progress: 100 },
              { bitrate: 256, status: 'completed', progress: 100 },
            ],
          },
        },
        connected: true,
        refreshChapterIds: [],
      },
    });

    renderTranscodingHook(['ch-1'], store);

    await waitFor(() => {
      expect(pollChapterTranscodingUpdatesMock).not.toHaveBeenCalled();
    });
  });

  it('polls only chapters that still have in-progress bitrates', async () => {
    const store = createStore({
      transcoding: {
        statusByChapterId: {
          'ch-1': {
            chapterId: 'ch-1',
            canStream: true,
            masterPlaylistReady: true,
            aggregateStatus: 'completed',
            bitrates: [
              { bitrate: 64, status: 'completed', progress: 100 },
              { bitrate: 128, status: 'completed', progress: 100 },
              { bitrate: 256, status: 'completed', progress: 100 },
            ],
          },
          'ch-2': {
            chapterId: 'ch-2',
            canStream: false,
            masterPlaylistReady: false,
            aggregateStatus: 'processing',
            bitrates: [{ bitrate: 128, status: 'processing', progress: 45 }],
          },
        },
        connected: true,
        refreshChapterIds: [],
      },
    });

    renderTranscodingHook(['ch-1', 'ch-2'], store);

    await waitFor(() => {
      expect(pollChapterTranscodingUpdatesMock).toHaveBeenCalledWith(['ch-2']);
    });
  });
});
