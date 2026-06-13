import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getChapterTranscodingStatus,
  subscribeChapterTranscodingEvents,
} from '../utils/streamingApi';
import type { ChapterTranscodingStatus, TranscodingEvent } from '../types/streaming';

const POLL_INTERVAL_MS = 10_000;

function mergeEvent(
  current: ChapterTranscodingStatus | undefined,
  event: TranscodingEvent
): ChapterTranscodingStatus {
  const base: ChapterTranscodingStatus = current ?? {
    chapterId: event.chapterId,
    canStream: false,
    masterPlaylistReady: false,
    aggregateStatus: 'processing',
    bitrates: [],
  };

  const bitrates = [...base.bitrates];
  const index = bitrates.findIndex(b => b.bitrate === event.bitrate);
  const updated = {
    bitrate: event.bitrate,
    status: event.status,
    progress: event.progress,
    ...(event.errorMessage ? { errorMessage: event.errorMessage } : {}),
  };

  if (index >= 0) {
    bitrates[index] = updated;
  } else {
    bitrates.push(updated);
  }

  return { ...base, bitrates };
}

export function useChapterTranscodingEvents(chapterIds: string[]) {
  const [statusByChapter, setStatusByChapter] = useState<
    Record<string, ChapterTranscodingStatus>
  >({});
  const [connected, setConnected] = useState(true);
  const idsKey = useMemo(() => chapterIds.slice().sort().join(','), [chapterIds]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshStatuses = useCallback(async () => {
    if (!chapterIds.length) {
      return;
    }
    const results = await Promise.allSettled(
      chapterIds.map(id => getChapterTranscodingStatus(id))
    );
    setStatusByChapter(prev => {
      const next = { ...prev };
      results.forEach((result, index) => {
        const chapterId = chapterIds[index];
        if (result.status === 'fulfilled' && chapterId) {
          next[chapterId] = result.value;
        }
      });
      return next;
    });
  }, [chapterIds]);

  useEffect(() => {
    if (!chapterIds.length) {
      return;
    }

    void refreshStatuses();

    const unsubscribe = subscribeChapterTranscodingEvents(
      chapterIds,
      event => {
        setConnected(true);
        setStatusByChapter(prev => ({
          ...prev,
          [event.chapterId]: mergeEvent(prev[event.chapterId], event),
        }));
      },
      snapshot => {
        setConnected(true);
        setStatusByChapter(prev => ({
          ...prev,
          [snapshot.chapterId]: {
            ...(prev[snapshot.chapterId] ?? {
              chapterId: snapshot.chapterId,
              canStream: false,
              masterPlaylistReady: false,
              aggregateStatus: 'processing',
            }),
            bitrates: snapshot.bitrates,
          },
        }));
      },
      () => setConnected(false)
    );

    pollRef.current = setInterval(() => {
      void refreshStatuses();
    }, POLL_INTERVAL_MS);

    return () => {
      unsubscribe();
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [idsKey, chapterIds, refreshStatuses]);

  return { statusByChapter, connected };
}
