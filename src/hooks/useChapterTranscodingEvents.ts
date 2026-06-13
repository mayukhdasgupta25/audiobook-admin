import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  clearChapterTranscodingRefreshQueue,
  mergeChapterTranscodingStatuses,
  selectRefreshChapterIds,
  selectTranscodingConnected,
  selectTranscodingStatusByChapter,
  setTranscodingConnected,
} from '../store/slices/transcodingSlice';
import {
  chapterNeedsTranscodingPoll,
  normalizeChapterTranscodingStatus,
  pollChapterTranscodingUpdates,
} from '../utils/streamingApi';
import type { ChapterTranscodingStatus } from '../types/streaming';

const POLL_INTERVAL_MS = 15_000;

function applySnapshotFallback(
  current: ChapterTranscodingStatus | undefined,
  chapterId: string,
  bitrates: ChapterTranscodingStatus['bitrates']
): ChapterTranscodingStatus {
  return normalizeChapterTranscodingStatus({
    ...(current ?? {
      chapterId,
      canStream: false,
      masterPlaylistReady: false,
      aggregateStatus: 'processing',
    }),
    bitrates,
  });
}

function buildMergedStatuses(
  idsToPoll: string[],
  statuses: PromiseSettledResult<ChapterTranscodingStatus>[],
  snapshots: { chapterId: string; bitrates: ChapterTranscodingStatus['bitrates'] }[],
  existing: Record<string, ChapterTranscodingStatus>
): ChapterTranscodingStatus[] {
  const merged: ChapterTranscodingStatus[] = [];
  const mergedIds = new Set<string>();

  statuses.forEach((result, index) => {
    const chapterId = idsToPoll[index];
    if (result.status === 'fulfilled' && chapterId) {
      merged.push(result.value);
      mergedIds.add(chapterId);
    }
  });

  snapshots.forEach(snapshot => {
    if (!mergedIds.has(snapshot.chapterId)) {
      merged.push(
        applySnapshotFallback(
          existing[snapshot.chapterId],
          snapshot.chapterId,
          snapshot.bitrates
        )
      );
      mergedIds.add(snapshot.chapterId);
    }
  });

  return merged;
}

export function useChapterTranscodingEvents(chapterIds: string[]) {
  const dispatch = useAppDispatch();
  const statusByChapter = useAppSelector(selectTranscodingStatusByChapter);
  const connected = useAppSelector(selectTranscodingConnected);
  const refreshChapterIds = useAppSelector(selectRefreshChapterIds);
  const refreshKey = refreshChapterIds.join(',');

  const idsKey = useMemo(() => chapterIds.slice().sort().join(','), [chapterIds]);
  const chapterIdsRef = useRef(chapterIds);
  chapterIdsRef.current = chapterIds;
  const statusByChapterRef = useRef(statusByChapter);
  statusByChapterRef.current = statusByChapter;
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingRef = useRef(false);
  const stopPollingRef = useRef(false);

  const stopPolling = useCallback(() => {
    stopPollingRef.current = true;
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const stopPollingRefStable = useRef(stopPolling);
  stopPollingRefStable.current = stopPolling;

  const refreshAllRef = useRef<(forceIds?: string[]) => Promise<void>>(
    async () => {}
  );

  refreshAllRef.current = async (forceIds?: string[]) => {
    const ids = chapterIdsRef.current;
    if (!ids.length || pollingRef.current || stopPollingRef.current) {
      return;
    }

    const existing = statusByChapterRef.current;
    const idsToPoll = forceIds?.length
      ? forceIds.filter(id => ids.includes(id))
      : ids.filter(id => chapterNeedsTranscodingPoll(existing[id]));

    if (!idsToPoll.length) {
      return;
    }

    pollingRef.current = true;
    try {
      const { statuses, snapshots, hasServerError } =
        await pollChapterTranscodingUpdates(idsToPoll);

      if (hasServerError) {
        dispatch(setTranscodingConnected(false));
        stopPollingRefStable.current();
        return;
      }

      dispatch(setTranscodingConnected(true));

      const toMerge = buildMergedStatuses(
        idsToPoll,
        statuses,
        snapshots,
        existing
      );

      if (toMerge.length) {
        dispatch(mergeChapterTranscodingStatuses(toMerge));
      }
    } catch {
      dispatch(setTranscodingConnected(false));
    } finally {
      pollingRef.current = false;
    }
  };

  useEffect(() => {
    if (!idsKey) {
      return;
    }

    stopPollingRef.current = false;
    void refreshAllRef.current();

    pollRef.current = setInterval(() => {
      void refreshAllRef.current();
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [idsKey]);

  useEffect(() => {
    if (!refreshKey) {
      return;
    }

    void refreshAllRef.current(refreshChapterIds);
    dispatch(clearChapterTranscodingRefreshQueue());
  }, [dispatch, refreshKey, refreshChapterIds]);

  return { connected };
}
