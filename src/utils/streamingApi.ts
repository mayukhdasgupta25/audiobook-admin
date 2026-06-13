import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getContentApiBaseUrl, getAuthHeaders } from './config';
import type {
  ChapterTranscodingStatus,
  TranscodingEvent,
  TranscodingSnapshotEvent,
} from '../types/streaming';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
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
    throw new Error(`Failed to fetch transcoding status (${response.status})`);
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

export function subscribeChapterTranscodingEvents(
  chapterIds: string[],
  onEvent: (event: TranscodingEvent) => void,
  onSnapshot: (snapshot: TranscodingSnapshotEvent) => void,
  onError?: (error: unknown) => void
): () => void {
  const controller = new AbortController();
  const query = chapterIds.map(id => encodeURIComponent(id)).join(',');
  const url =
    chapterIds.length === 1
      ? `${streamBaseUrl()}/chapters/${chapterIds[0]}/transcoding/events`
      : `${streamBaseUrl()}/transcoding/events?chapterIds=${query}`;

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

export function computeStreamBadge(
  status?: ChapterTranscodingStatus
): { label: string; className: string } {
  if (!status) {
    return { label: 'Unknown', className: 'chapter-card-stream-unknown' };
  }

  const inProgress = status.bitrates.filter(
    b => b.status === 'pending' || b.status === 'processing'
  );
  if (inProgress.length > 0) {
    const avg = Math.round(
      inProgress.reduce((sum, b) => sum + b.progress, 0) / inProgress.length
    );
    return {
      label: `Processing (${avg}%)`,
      className: 'chapter-card-stream-processing',
    };
  }

  if (status.aggregateStatus === 'completed' && status.canStream) {
    return { label: 'Ready', className: 'chapter-card-stream-ready' };
  }
  if (status.aggregateStatus === 'partial') {
    return { label: 'Partial', className: 'chapter-card-stream-partial' };
  }
  if (status.aggregateStatus === 'failed') {
    return { label: 'Failed', className: 'chapter-card-stream-failed' };
  }

  return { label: 'Processing', className: 'chapter-card-stream-processing' };
}
