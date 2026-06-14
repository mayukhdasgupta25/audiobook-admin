import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getContentApiBaseUrl, getAuthHeaders } from './config';
import type {
  BitrateTranscodingStatus,
  ChapterTranscodingStatus,
  TranscodingEvent,
  TranscodingSnapshotEvent,
} from '../types/streaming';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export class StreamingApiHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'StreamingApiHttpError';
    this.status = status;
  }
}

export function isStreamingServerError(error: unknown): boolean {
  if (error instanceof StreamingApiHttpError) {
    return error.status >= 500 && error.status <= 599;
  }
  return false;
}

function streamBaseUrl(): string {
  return `${getContentApiBaseUrl()}/api/v1/stream`;
}

export async function getChapterTranscodingStatus(
  chapterId: string
): Promise<ChapterTranscodingStatus> {
  const response = await fetch(
    `${streamBaseUrl()}/chapters/${chapterId}/transcoding`,
    { headers: getAuthHeaders() }
  );
  if (!response.ok) {
    throw new StreamingApiHttpError(
      `Failed to fetch transcoding status (${response.status})`,
      response.status
    );
  }
  const body = (await response.json()) as ApiEnvelope<ChapterTranscodingStatus>;
  return body.data;
}

export async function retryChapterTranscoding(
  chapterId: string,
  bitrates?: number[]
): Promise<{ retriedBitrates: number[] }> {
  const response = await fetch(
    `${streamBaseUrl()}/chapters/${chapterId}/transcode/retry`,
    {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bitrates }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to retry transcoding (${response.status})`);
  }
  const body = (await response.json()) as ApiEnvelope<{ retriedBitrates: number[] }>;
  return body.data;
}

function parseSnapshotSseEvent(rawEvent: string): TranscodingSnapshotEvent | null {
  const lines = rawEvent.split('\n');
  let eventType: string | undefined;
  let data: string | undefined;

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      data = line.slice(5).trim();
    }
  }

  if (eventType !== 'snapshot' || !data) {
    return null;
  }

  return JSON.parse(data) as TranscodingSnapshotEvent;
}

function buildTranscodingEventsUrl(chapterIds: string[]): string {
  const query = chapterIds.map(id => encodeURIComponent(id)).join(',');
  return chapterIds.length === 1
    ? `${streamBaseUrl()}/chapters/${chapterIds[0]}/transcoding/events`
    : `${streamBaseUrl()}/transcoding/events?chapterIds=${query}`;
}

/**
 * Opens the events stream briefly to read initial snapshot events, then closes.
 */
export async function fetchChapterTranscodingEventSnapshots(
  chapterIds: string[]
): Promise<TranscodingSnapshotEvent[]> {
  if (!chapterIds.length) {
    return [];
  }

  const controller = new AbortController();
  const snapshots: TranscodingSnapshotEvent[] = [];
  const pendingIds = new Set(chapterIds);
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  try {
    const response = await fetch(buildTranscodingEventsUrl(chapterIds), {
      headers: getAuthHeaders() as Record<string, string>,
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      throw new StreamingApiHttpError(
        `Failed to fetch transcoding events (${response.status})`,
        response.status
      );
    }

    reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (pendingIds.size > 0) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      let boundaryIndex = buffer.indexOf('\n\n');
      while (boundaryIndex !== -1) {
        const chunk = buffer.slice(0, boundaryIndex);
        buffer = buffer.slice(boundaryIndex + 2);
        boundaryIndex = buffer.indexOf('\n\n');

        if (!chunk.trim() || chunk.startsWith(':')) {
          continue;
        }

        const snapshot = parseSnapshotSseEvent(chunk);
        if (snapshot && pendingIds.has(snapshot.chapterId)) {
          snapshots.push(snapshot);
          pendingIds.delete(snapshot.chapterId);
        }
      }
    }
  } catch (error) {
    if (!controller.signal.aborted) {
      throw error;
    }
  } finally {
    controller.abort();
    if (reader) {
      await reader.cancel().catch(() => undefined);
    }
  }

  return snapshots;
}

export async function pollChapterTranscodingUpdates(
  chapterIds: string[]
): Promise<{
  statuses: PromiseSettledResult<ChapterTranscodingStatus>[];
  snapshots: TranscodingSnapshotEvent[];
  hasServerError: boolean;
}> {
  const statuses = await Promise.allSettled(
    chapterIds.map(id => getChapterTranscodingStatus(id))
  );

  const hasStatusServerError = statuses.some(
    result => result.status === 'rejected' && isStreamingServerError(result.reason)
  );

  let snapshots: TranscodingSnapshotEvent[] = [];
  let hasEventsServerError = false;

  try {
    snapshots = await fetchChapterTranscodingEventSnapshots(chapterIds);
  } catch (error) {
    if (isStreamingServerError(error)) {
      hasEventsServerError = true;
    }
  }

  return {
    statuses,
    snapshots,
    hasServerError: hasStatusServerError || hasEventsServerError,
  };
}

export function subscribeChapterTranscodingEvents(
  chapterIds: string[],
  onEvent: (event: TranscodingEvent) => void,
  onSnapshot: (snapshot: TranscodingSnapshotEvent) => void,
  onError?: (error: unknown) => void
): () => void {
  const controller = new AbortController();
  const url = buildTranscodingEventsUrl(chapterIds);

  void fetchEventSource(url, {
    signal: controller.signal,
    headers: getAuthHeaders() as Record<string, string>,
    onmessage(message) {
      if (!message.data) {
        return;
      }
      if (message.event === 'snapshot') {
        onSnapshot(JSON.parse(message.data) as TranscodingSnapshotEvent);
        return;
      }
      if (message.event === 'transcoding' || !message.event) {
        onEvent(JSON.parse(message.data) as TranscodingEvent);
      }
    },
    onerror(error) {
      onError?.(error);
      throw error;
    },
  }).catch(error => {
    if (!controller.signal.aborted) {
      onError?.(error);
    }
  });

  return () => controller.abort();
}

export function areAllTargetBitratesComplete(
  status: ChapterTranscodingStatus | undefined
): boolean {
  if (!status) {
    return false;
  }

  return TARGET_BITRATES.every(bitrate => {
    const row = getBitrateRow(status, bitrate);
    return row.status === 'completed' && row.progress >= 100;
  });
}

export function normalizeChapterTranscodingStatus(
  status: ChapterTranscodingStatus
): ChapterTranscodingStatus {
  const targetRows = TARGET_BITRATES.map(bitrate => getBitrateRow(status, bitrate));
  const inProgress = targetRows.filter(
    row => row.status === 'pending' || row.status === 'processing'
  );
  const failed = targetRows.filter(row => row.status === 'failed');
  const completed = targetRows.filter(
    row => row.status === 'completed' && row.progress >= 100
  );

  let aggregateStatus: ChapterTranscodingStatus['aggregateStatus'];
  if (inProgress.length > 0) {
    aggregateStatus = 'processing';
  } else if (completed.length === TARGET_BITRATES.length) {
    aggregateStatus = 'completed';
  } else if (failed.length > 0 && completed.length > 0) {
    aggregateStatus = 'partial';
  } else if (failed.length > 0) {
    aggregateStatus = 'failed';
  } else if (completed.length > 0) {
    aggregateStatus = 'partial';
  } else {
    aggregateStatus = status.aggregateStatus ?? 'not_started';
  }

  const allComplete = completed.length === TARGET_BITRATES.length;

  return {
    ...status,
    aggregateStatus,
    canStream: allComplete,
    masterPlaylistReady: allComplete || status.masterPlaylistReady,
  };
}

export function computeStreamBadge(
  status?: ChapterTranscodingStatus
): { label: string; className: string } {
  if (!status) {
    return { label: 'Unknown', className: 'chapter-stream-badge-unknown' };
  }

  const normalized = normalizeChapterTranscodingStatus(status);

  const inProgress = TARGET_BITRATES.map(bitrate =>
    getBitrateRow(normalized, bitrate)
  ).filter(row => row.status === 'pending' || row.status === 'processing');

  if (inProgress.length > 0) {
    const avg = Math.round(
      inProgress.reduce((sum, row) => sum + row.progress, 0) / inProgress.length
    );
    return {
      label: `Processing (${avg}%)`,
      className: 'chapter-stream-badge-processing',
    };
  }

  if (areAllTargetBitratesComplete(normalized)) {
    return { label: 'Ready', className: 'chapter-stream-badge-ready' };
  }
  if (normalized.aggregateStatus === 'partial') {
    return { label: 'Partial', className: 'chapter-stream-badge-partial' };
  }
  if (normalized.aggregateStatus === 'failed') {
    return { label: 'Failed', className: 'chapter-stream-badge-failed' };
  }

  return { label: 'Processing', className: 'chapter-stream-badge-processing' };
}

export const TARGET_BITRATES = [64, 128, 256] as const;

export function getBitrateRow(
  status: ChapterTranscodingStatus | undefined,
  bitrate: number
): BitrateTranscodingStatus {
  return (
    status?.bitrates.find(row => row.bitrate === bitrate) ?? {
      bitrate,
      status: 'pending',
      progress: 0,
    }
  );
}

export function chapterNeedsTranscodingPoll(
  status: ChapterTranscodingStatus | undefined
): boolean {
  if (!status) {
    return true;
  }

  return TARGET_BITRATES.some(bitrate => {
    const row = getBitrateRow(status, bitrate);
    return row.progress < 100 && row.status !== 'failed';
  });
}
